import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, RefreshCcw, Send, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// ANPR API Endpoint from P2
const API_URL = "https://hermit-in-my-anpr-api.hf.space/recognise";

// Helper to convert data URL to base64
const dataURLtoBase64 = (dataUrl: string) => {
  return dataUrl.split(",")[1];
};

const Report = () => {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setApiError("Could not access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      // Stop camera stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setImage(dataUrl);

      // Stop camera
      if (video.srcObject) {
        (video.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }

      setIsProcessing(true);
      setApiError(null);

      try {
        const base64Image = dataURLtoBase64(dataUrl);
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) throw new Error("API request failed");
        const result = await response.json();

        if (result.plates && result.plates.length > 0) {
          const plateText = result.plates[0].text;
          setTitle(`Violation by: ${plateText}`);
          setDescription(
            `License plate ${plateText} detected. Confidence: ${(
              result.plates[0].recognition_confidence * 100
            ).toFixed(1)}%`
          );
          toast({
            title: "License Plate Detected",
            description: `Plate: ${plateText}`,
          });
        } else {
          setTitle("General Violation Report");
          setDescription("No license plate was automatically detected.");
        }
      } catch (err) {
        console.error("Error calling ANPR API:", err);
        setApiError(
          "Could not detect license plate. Please enter details manually."
        );
        setTitle("General Violation Report");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setTitle("");
    setDescription("");
    setApiError(null);
    setIsProcessing(false);
    startCamera();
  };

  const handleNext = () => {
    if (image) {
      navigate("/report-details", { state: { image, title, description } });
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle>Report a Violation</CardTitle>
            <CardDescription>
              {image ? "Review the captured photo" : "Capture a photo or video"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              {image ? (
                <img
                  src={image}
                  alt="Captured report"
                  className="rounded-lg w-full"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-black"
                ></video>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>

            {isProcessing && (
              <div className="text-center my-3 flex items-center justify-center gap-2 text-primary">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Analyzing for license plate...</p>
              </div>
            )}
            {apiError && (
              <Alert variant="destructive" className="mt-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>ANPR Error</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {image && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter violation title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the violation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              {image ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={retakePhoto}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? "Processing..." : "Next: Add Details"}
                    <Send className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  onClick={captureImage}
                  className="w-full text-lg"
                >
                  <Camera className="h-6 w-6 mr-2" />
                  Capture
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Report;