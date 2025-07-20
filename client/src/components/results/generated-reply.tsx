import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw } from "lucide-react";
import { useReplyGenerator } from "../../hooks/use-reply-generator";
import { useToast } from "@/hooks/use-toast";

export default function GeneratedReply() {
  const { lastReply, regenerateLastReply, isLoading } = useReplyGenerator();
  const { toast } = useToast();

  if (!lastReply) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lastReply.text);
      toast({
        title: "Success",
        description: "Reply copied to clipboard!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleRegenerate = () => {
    regenerateLastReply();
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Reply</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" onClick={handleRegenerate} disabled={isLoading}>
                <RotateCcw className="h-4 w-4 mr-2" />
                {isLoading ? 'Regenerating...' : 'Regenerate'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 text-gray-800 leading-relaxed">
            {lastReply.text}
          </div>
          
          {lastReply.metadata && (
            <div className="mt-4 text-sm text-gray-500">
              <p>Reply type: {lastReply.metadata.replyType} | Tone: {lastReply.metadata.tone}</p>
              {lastReply.metadata.threadUrl && (
                <p>
                  Thread: <a 
                    href={lastReply.metadata.threadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {lastReply.metadata.threadUrl}
                  </a>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
