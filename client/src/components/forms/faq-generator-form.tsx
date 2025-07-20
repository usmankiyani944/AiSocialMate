import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { HelpCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const formSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  brandName: z.string().min(1, "Brand name is required"),
  brandWebsite: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  brandDescription: z.string().optional(),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
});

const platformOptions = [
  { id: "reddit", label: "Reddit", checked: true },
  { id: "quora", label: "Quora", checked: true },
  { id: "twitter", label: "Twitter/X", checked: false },
  { id: "facebook", label: "Facebook", checked: false },
  { id: "linkedin", label: "LinkedIn", checked: false },
];

export default function FAQGeneratorForm() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: "",
      brandName: "",
      brandWebsite: "",
      brandDescription: "",
      platforms: ["reddit", "quora"],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to generate FAQ');
      }

      const data = await response.json();
      
      if (data.success) {
        setFaqs(data.faqs);
        toast({
          title: "Success",
          description: `Generated ${data.faqs.length} FAQ items!`,
        });
      } else {
        throw new Error(data.message || 'FAQ generation failed');
      }
    } catch (error) {
      console.error('FAQ generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate FAQ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyFAQs = () => {
    const faqText = faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
    navigator.clipboard.writeText(faqText);
    toast({
      title: "Copied!",
      description: "FAQ content copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Generate FAQ</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Generate top 10 FAQ questions based on social media discussions
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords/Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="AI tools, social media marketing..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Main topic or keywords to search for questions about
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Brand Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourbrand.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your brand, services, and what makes you unique..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Help AI understand your brand context for better FAQ answers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platforms"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Select Platforms</FormLabel>
                      <FormDescription>
                        Choose platforms to search for questions
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {platformOptions.map((platform) => (
                        <FormField
                          key={platform.id}
                          control={form.control}
                          name="platforms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={platform.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(platform.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, platform.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== platform.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {platform.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating FAQ...
                  </>
                ) : (
                  <>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Generate FAQ
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {faqs.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Generated FAQ ({faqs.length} items)</CardTitle>
              <Button variant="outline" onClick={copyFAQs}>
                Copy All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Q: {faq.question}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    A: {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}