import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Wand2, ChevronDown } from "lucide-react";

const frameworks = [
  {
    value: "AIDA",
    label: "AIDA",
    description: "Atención, Interés, Deseo, Acción"
  },
  {
    value: "PAS",
    label: "PAS", 
    description: "Problema, Agitación, Solución"
  },
  {
    value: "Hook-Story-CTA",
    label: "Hook-Story-CTA",
    description: "Gancho, Historia, Llamada a la Acción"
  },
  {
    value: "Antes/Después",
    label: "Antes/Después",
    description: "Transformación y resultados"
  },
  {
    value: "Problema/Solución",
    label: "Problema/Solución",
    description: "Identificar y resolver dolor"
  },
  {
    value: "Storytelling",
    label: "Storytelling",
    description: "Narrativa emocional"
  }
];

const formSchema = z.object({
  brandInfo: z.string().min(10, "Proporciona más detalles sobre tu marca"),
  framework: z.string().min(1, "Selecciona un framework neurológico"),
});

type FormData = z.infer<typeof formSchema>;

interface ScriptGeneratorProps {
  analysisId: number;
  onScriptGenerated: (script: any) => void;
}

export default function ScriptGenerator({ analysisId, onScriptGenerated }: ScriptGeneratorProps) {
  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandInfo: "",
      framework: "",
    },
  });

  const generateScriptMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", `/api/generate-script/${analysisId}`, data);
      return response.json();
    },
    onSuccess: (result) => {
      onScriptGenerated(result);
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      toast({
        title: "¡Guión Generado!",
        description: "Tu guión personalizado está listo.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "No autorizado",
          description: "Sesión expirada. Iniciando sesión...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error al generar guión",
        description: error.message || "Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    generateScriptMutation.mutate(data);
  };

  const selectedFrameworkData = frameworks.find(f => f.value === selectedFramework);

  return (
    <Card className="shadow-lg border border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <Wand2 className="h-5 w-5 text-secondary mr-2" />
          Generar Guión Personalizado
        </CardTitle>
        <p className="text-gray-600">
          Ahora crea tu guión usando un Framework Neurológico específico
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Framework Neurológico <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedFramework(value);
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-50 focus:bg-white">
                        <SelectValue placeholder="Selecciona un framework..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frameworks.map((framework) => (
                        <SelectItem key={framework.value} value={framework.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{framework.label}</span>
                            <span className="text-xs text-gray-500">{framework.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedFrameworkData && (
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>{selectedFrameworkData.label}:</strong> {selectedFrameworkData.description}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Información de Marca/Producto <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu marca, producto, audiencia objetivo, mensaje clave..."
                      className="resize-none bg-gray-50 focus:bg-white"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-secondary to-primary text-white py-4 px-6 text-lg hover:opacity-90 shadow-lg"
              disabled={generateScriptMutation.isPending}
            >
              <span className="flex items-center justify-center space-x-2">
                {generateScriptMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generando Guión...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    <span>Generar Guión con {selectedFrameworkData?.label || 'Framework'}</span>
                  </>
                )}
              </span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}