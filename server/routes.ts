import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlertSchema, insertSearchResultSchema, insertGeneratedReplySchema } from "@shared/schema";
import OpenAI from "openai";

// API Keys from environment variables with fallbacks
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.CHATGPT_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

if (!OPENAI_API_KEY) throw new Error("Missing OpenAI API key");
if (!SERPER_API_KEY) throw new Error("Missing Serper API key");

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: OPENAI_API_KEY 
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Search endpoints
  app.post("/api/search/brand-opportunities", async (req, res) => {
    try {
      const { 
        brandName, 
        competitorName, 
        keywords, 
        excludeKeywords, 
        platforms, 
        timeRange,
        sentiment,
        minEngagement,
        maxResults = 10,
        serperApiKey
      } = req.body;

      if (!brandName || !competitorName) {
        return res.status(400).json({ message: "Brand name and competitor name are required" });
      }

      // Construct search query
      const searchQuery = `${competitorName} ${keywords ? keywords : ''} -${brandName} ${excludeKeywords ? excludeKeywords.split(',').map((k: string) => `-${k.trim()}`).join(' ') : ''}`.trim();

      // Use provided API key or default
      const apiKey = serperApiKey || SERPER_API_KEY;

      // Search each platform
      const searchPromises = platforms.map(async (platform: string) => {
        try {
          const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
              'X-API-KEY': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: `${searchQuery} site:${getPlatformDomain(platform)}`,
              num: Math.min(maxResults, 10),
              hl: 'en',
              gl: 'us'
            }),
          });

          if (!response.ok) {
            throw new Error(`Serper API error: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            platform,
            results: data.organic || []
          };
        } catch (error) {
          console.error(`Error searching ${platform}:`, error);
          return {
            platform,
            results: [],
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const platformResults = await Promise.all(searchPromises);
      
      // Flatten and format results
      const formattedResults = platformResults.flatMap(pr => 
        pr.results.map((result: any) => ({
          title: result.title,
          snippet: result.snippet,
          url: result.link,
          platform: pr.platform,
          displayLink: result.displayLink,
          position: result.position
        }))
      );

      // Store search results
      await storage.createSearchResult({
        type: 'brand-opportunity',
        query: searchQuery,
        results: formattedResults,
        platforms
      });

      res.json({
        success: true,
        results: formattedResults,
        totalResults: formattedResults.length,
        query: searchQuery
      });

    } catch (error) {
      console.error('Brand opportunities search error:', error);
      res.status(500).json({ 
        message: "Failed to search brand opportunities",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/search/threads", async (req, res) => {
    try {
      const { 
        keywords, 
        platforms, 
        maxResults = 10,
        serperApiKey
      } = req.body;

      if (!keywords) {
        return res.status(400).json({ message: "Keywords are required" });
      }

      const apiKey = serperApiKey || SERPER_API_KEY;

      // Search each platform
      const searchPromises = platforms.map(async (platform: string) => {
        try {
          const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
              'X-API-KEY': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: `${keywords} site:${getPlatformDomain(platform)}`,
              num: Math.min(maxResults, 10),
              hl: 'en',
              gl: 'us'
            }),
          });

          if (!response.ok) {
            throw new Error(`Serper API error: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            platform,
            results: data.organic || []
          };
        } catch (error) {
          console.error(`Error searching ${platform}:`, error);
          return {
            platform,
            results: [],
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const platformResults = await Promise.all(searchPromises);
      
      // Format results
      const formattedResults = platformResults.flatMap(pr => 
        pr.results.map((result: any) => ({
          title: result.title,
          snippet: result.snippet,
          url: result.link,
          platform: pr.platform,
          displayLink: result.displayLink,
          position: result.position
        }))
      );

      // Store search results
      await storage.createSearchResult({
        type: 'thread-discovery',
        query: keywords,
        results: formattedResults,
        platforms
      });

      res.json({
        success: true,
        results: formattedResults,
        totalResults: formattedResults.length,
        query: keywords
      });

    } catch (error) {
      console.error('Thread discovery search error:', error);
      res.status(500).json({ 
        message: "Failed to discover threads",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // AI Reply Generation
  app.post("/api/generate-reply", async (req, res) => {
    try {
      const { 
        threadUrl,
        replyType,
        tone,
        brandName,
        brandContext,
        creativity = "0.7",
        aiProvider = "openai",
        model = "gpt-4o",
        customApiKey
      } = req.body;

      if (!threadUrl) {
        return res.status(400).json({ message: "Thread URL is required" });
      }

      // Use custom API key if provided
      const apiKey = customApiKey || OPENAI_API_KEY;
      const client = customApiKey ? new OpenAI({ apiKey: customApiKey }) : openai;

      // Advanced AI techniques: Zero-shot, Few-shot, Chain-of-thought
      const systemPrompt = `You are an expert social media manager that uses advanced AI techniques to generate authentic, helpful replies.

TECHNIQUES TO USE:
1. Zero-shot reasoning: Analyze the context and generate appropriate responses without examples
2. Few-shot learning: Apply patterns from successful social media interactions  
3. Chain-of-thought: Break down the response generation process step by step

CHAIN-OF-THOUGHT PROCESS:
1. Analyze the thread context and identify key discussion points
2. Consider the brand positioning and value proposition
3. Match the platform's communication style and norms
4. Generate a response that adds genuine value
5. Ensure tone and type alignment with requirements

FEW-SHOT EXAMPLES:
Supportive tone: "I completely understand your frustration with this. Here's what worked for me..."
Professional tone: "This is an interesting perspective. Based on our experience..."
Friendly tone: "Great question! I'd love to share some thoughts on this..."
Informative tone: "Here are a few key points that might help clarify this..."

REQUIREMENTS:
- Reply type: ${replyType}
- Tone: ${tone}
- Brand: ${brandName || 'the brand'}
- Brand context: ${brandContext || 'Not provided'}
- Be authentic and valuable, not overly promotional
- Match the platform's conversational style
- Keep replies concise but impactful`;

      const userPrompt = `Using chain-of-thought reasoning, generate a ${tone.toLowerCase()} ${replyType.toLowerCase()} reply for the social media thread at: ${threadUrl}

Step 1: Analyze what type of discussion this appears to be based on the URL
Step 2: Consider how the brand can add value to this conversation  
Step 3: Craft the final reply that aligns with the requirements

Generate only the final reply text that would be posted.`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: parseFloat(creativity),
        max_tokens: 500
      });

      const generatedText = response.choices[0].message.content || "";

      // Store generated reply
      const reply = await storage.createGeneratedReply({
        threadUrl,
        replyType,
        tone,
        brandName: brandName || null,
        brandContext: brandContext || null,
        brandUrl: req.body.brandUrl || null,
        generatedText,
        creativity,
        aiProvider,
        model
      });

      res.json({
        success: true,
        reply: {
          id: reply.id,
          text: generatedText,
          metadata: {
            threadUrl,
            replyType,
            tone,
            brandName,
            creativity,
            model
          }
        }
      });

    } catch (error) {
      console.error('Reply generation error:', error);
      res.status(500).json({ 
        message: "Failed to generate reply",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Alerts CRUD
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data", error });
    }
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAlert(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Alert not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  // Generated replies
  app.get("/api/replies", async (req, res) => {
    try {
      const replies = await storage.getGeneratedReplies();
      res.json(replies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch replies" });
    }
  });

  // Reply Feedback
  app.post("/api/replies/:id/feedback", async (req, res) => {
    try {
      const { feedback } = req.body; // 'like' or 'dislike'
      const replyId = parseInt(req.params.id);
      
      // Update reply with feedback (simplified for mem storage)
      const replies = await storage.getGeneratedReplies();
      const reply = replies.find(r => r.id === replyId);
      
      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }
      
      // In a real implementation, we would update the database
      // For now, just return success
      res.json({ success: true, feedback });
    } catch (error) {
      console.error('Failed to save feedback:', error);
      res.status(500).json({ message: "Failed to save feedback" });
    }
  });

  // FAQ Generation
  app.post("/api/generate-faq", async (req, res) => {
    try {
      const { 
        keyword,
        brandName,
        brandWebsite,
        brandDescription,
        platforms = ['reddit', 'quora']
      } = req.body;

      if (!keyword || !brandName) {
        return res.status(400).json({ message: "Keyword and brand name are required" });
      }

      // Search for questions across platforms
      const searchPromises = platforms.map(async (platform: string) => {
        try {
          const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
              'X-API-KEY': SERPER_API_KEY!,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: `${keyword} questions site:${getPlatformDomain(platform)}`,
              num: 10,
            }),
          });

          const data = await response.json();
          return data.organic || [];
        } catch (error) {
          console.error(`Error searching ${platform}:`, error);
          return [];
        }
      });

      const searchResults = await Promise.all(searchPromises);
      const allResults = searchResults.flat();

      // Generate FAQ using OpenAI
      const prompt = `Based on these search results about "${keyword}" and the brand "${brandName}", generate the top 10 most valuable FAQ questions and answers.

Brand: ${brandName}
Website: ${brandWebsite || 'Not provided'}
Description: ${brandDescription || 'Not provided'}

Search results: ${JSON.stringify(allResults.slice(0, 20))}

Generate a JSON object with an array called "faqs" containing objects with "question" and "answer" fields. Focus on questions that would be most valuable for the brand's website or customer support.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const faqData = JSON.parse(response.choices[0].message.content || '{"faqs": []}');

      res.json({
        success: true,
        faqs: faqData.faqs || [],
        keyword,
        brandName
      });

    } catch (error) {
      console.error('FAQ generation error:', error);
      res.status(500).json({ 
        message: "Failed to generate FAQ",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Search results
  app.get("/api/search-results", async (req, res) => {
    try {
      const type = req.query.type as string;
      const results = await storage.getSearchResults(type);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch search results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getPlatformDomain(platform: string): string {
  const domains: Record<string, string> = {
    'Reddit': 'reddit.com',
    'Quora': 'quora.com',
    'Facebook': 'facebook.com',
    'Twitter': 'twitter.com',
    'Twitter/X': 'twitter.com',
    'LinkedIn': 'linkedin.com',
    'YouTube': 'youtube.com'
  };
  return domains[platform] || platform.toLowerCase() + '.com';
}
