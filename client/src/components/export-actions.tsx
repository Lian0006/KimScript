import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  File, Share2, 
  Copy, 
  Eye,
  ExternalLink
} from "lucide-react";
import jsPDF from 'jspdf';

interface ExportActionsProps {
  analysisResult: any;
  type?: 'analysis' | 'script';
}

export default function ExportActions({ analysisResult, type = 'analysis' }: ExportActionsProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = 30;

      // Helper function for text wrapping with better spacing
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 11, isBold: boolean = false) => {
        if (!text || text.trim() === '') return y + 5;
        
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text.toString(), maxWidth);
        
        // Check if we need a new page
        const neededSpace = lines.length * (fontSize * 0.5) + 10;
        if (y + neededSpace > pageHeight - 30) {
          doc.addPage();
          y = 30;
        }
        
        doc.text(lines, x, y);
        return y + (lines.length * (fontSize * 0.5)) + 8;
      };

      // Header with brand gradient simulation
      doc.setFillColor(139, 92, 246);
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      const title = type === 'analysis' ? 'Video Analysis Report' : 'Generated Script';
      doc.text(title, pageWidth / 2, 17, { align: 'center' });

      yPosition = 40;

      // KimScript branding
      doc.setFontSize(14);
      doc.setTextColor(139, 92, 246);
      doc.setFont('helvetica', 'bold');
      doc.text('KimScript', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Transform Viral Videos into Marketing Gold', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Add horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Helper function for section headers
      const addSectionHeader = (title: string) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 30;
        }
        
        // Add some space before section
        yPosition += 5;
        
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPosition - 8, contentWidth, 16, 'F');
        doc.setFontSize(14);
        doc.setTextColor(139, 92, 246);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin + 8, yPosition + 2);
        yPosition += 25;
        
        return yPosition;
      };

      // Helper function for analysis fields
      const addAnalysisField = (label: string, value: string) => {
        if (yPosition > pageHeight - 25) {
          doc.addPage();
          yPosition = 30;
        }
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'normal');
        yPosition = addWrappedText(value || 'Not provided', margin + 5, yPosition, contentWidth - 10, 10);
        yPosition += 8;
      };

      // Video Information Section
      addSectionHeader('Video Information');
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'bold');
      doc.text('Video URL:', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(59, 130, 246);
      doc.setFont('helvetica', 'normal');
      yPosition = addWrappedText(analysisResult.videoUrl || 'Not provided', margin + 5, yPosition, contentWidth - 10, 10);
      yPosition += 5;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'bold');
      doc.text('Platform:', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'normal');
      doc.text(analysisResult.platform || 'Not specified', margin + 5, yPosition);
      yPosition += 15;

      if (type === 'analysis') {
        // Transcription Section
        addSectionHeader('Video Transcription');
        
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'normal');
        yPosition = addWrappedText(analysisResult.transcription || 'No transcription available', margin, yPosition, contentWidth, 10);
        yPosition += 10;

        // Hook Analysis Section
        yPosition = addSectionHeader('Hook Analysis');
        
        if (analysisResult.analysis) {
          addAnalysisField('Hook', analysisResult.analysis.hook);
          addAnalysisField('Hook Type', analysisResult.analysis.hookType);
          addAnalysisField('Effectiveness', analysisResult.analysis.effectiveness);
        }

        // Viral Elements Section
        yPosition = addSectionHeader('Viral Elements');
        
        if (analysisResult.analysis?.viralElements && analysisResult.analysis.viralElements.length > 0) {
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          doc.setFont('helvetica', 'normal');
          
          analysisResult.analysis.viralElements.forEach((element: string, index: number) => {
            yPosition = addWrappedText(`• ${element}`, margin + 5, yPosition, contentWidth - 10, 10);
          });
        } else {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.setFont('helvetica', 'italic');
          doc.text('No specific viral elements identified', margin + 5, yPosition);
          yPosition += 8;
        }
        yPosition += 10;

        // Core Analysis Fields
        if (analysisResult.analysis?.emotionalTone) {
          addAnalysisField('Emotional Tone', analysisResult.analysis.emotionalTone);
        }

        if (analysisResult.analysis?.viralMechanics) {
          addAnalysisField('Viral Mechanics', analysisResult.analysis.viralMechanics);
        }

        if (analysisResult.analysis?.cta) {
          addAnalysisField('Call to Action', analysisResult.analysis.cta);
        }

        // Additional Analysis Sections
        if (analysisResult.analysis?.psychologicalTriggers) {
          yPosition = addSectionHeader('Psychological Triggers');
          yPosition = addWrappedText(analysisResult.analysis.psychologicalTriggers, margin, yPosition, contentWidth, 10);
          yPosition += 10;
        }

        if (analysisResult.analysis?.targetAudience) {
          yPosition = addSectionHeader('Target Audience');
          yPosition = addWrappedText(analysisResult.analysis.targetAudience, margin, yPosition, contentWidth, 10);
          yPosition += 10;
        }

        if (analysisResult.analysis?.contentFramework) {
          yPosition = addSectionHeader('Content Framework');
          yPosition = addWrappedText(analysisResult.analysis.contentFramework, margin, yPosition, contentWidth, 10);
          yPosition += 10;
        }

        if (analysisResult.analysis?.viralPotential) {
          yPosition = addSectionHeader('Viral Potential Assessment');
          yPosition = addWrappedText(analysisResult.analysis.viralPotential, margin, yPosition, contentWidth, 10);
          yPosition += 10;
        }

        if (analysisResult.analysis?.engagementPrediction) {
          yPosition = addSectionHeader('Engagement Prediction');
          yPosition = addWrappedText(analysisResult.analysis.engagementPrediction, margin, yPosition, contentWidth, 10);
          yPosition += 10;
        }

        // Storytelling Structure
        if (analysisResult.analysis?.storytellingStructure) {
          yPosition = addSectionHeader('Storytelling Structure');
          
          const structure = analysisResult.analysis.storytellingStructure;
          if (structure.beginning) addAnalysisField('Beginning', structure.beginning);
          if (structure.middle) addAnalysisField('Middle', structure.middle);
          if (structure.end) addAnalysisField('End', structure.end);
        }

        // Key Phrases
        if (analysisResult.analysis?.keyPhrases && analysisResult.analysis.keyPhrases.length > 0) {
          yPosition = addSectionHeader('Key Phrases');
          
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          doc.setFont('helvetica', 'normal');
          
          analysisResult.analysis.keyPhrases.forEach((phrase: string, index: number) => {
            yPosition = addWrappedText(`• "${phrase}"`, margin + 5, yPosition, contentWidth - 10, 10);
          });
          yPosition += 10;
        }

        // Recommendations
        if (analysisResult.analysis?.improvementRecommendations && analysisResult.analysis.improvementRecommendations.length > 0) {
          yPosition = addSectionHeader('Improvement Recommendations');
          
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          doc.setFont('helvetica', 'normal');
          
          analysisResult.analysis.improvementRecommendations.forEach((rec: string, index: number) => {
            yPosition = addWrappedText(`${index + 1}. ${rec}`, margin + 5, yPosition, contentWidth - 10, 10);
          });
          yPosition += 10;
        }
      } else {
        // Generated Script Content
        if (analysisResult.generatedScript) {
          const script = analysisResult.generatedScript;
          
          // Hook Section
          yPosition = addSectionHeader('Script Hook');
          yPosition = addWrappedText(script.hook || 'No hook provided', margin, yPosition, contentWidth, 11);
          yPosition += 15;

          // Body Section
          yPosition = addSectionHeader('Script Body');
          yPosition = addWrappedText(script.body || 'No body content provided', margin, yPosition, contentWidth, 10);
          yPosition += 15;

          // Call to Action Section
          yPosition = addSectionHeader('Call to Action');
          yPosition = addWrappedText(script.cta || 'No CTA provided', margin, yPosition, contentWidth, 10);
          yPosition += 15;

          // Additional Script Details
          if (script.toneOfVoice) {
            addAnalysisField('Tone of Voice', script.toneOfVoice);
          }

          if (script.framework) {
            addAnalysisField('Framework Used', script.framework);
          }

          // Emotions
          if (script.emotions && script.emotions.length > 0) {
            yPosition = addSectionHeader('Target Emotions');
            
            doc.setFontSize(10);
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'normal');
            
            const emotionsList = script.emotions.join(', ');
            yPosition = addWrappedText(emotionsList, margin, yPosition, contentWidth, 10);
            yPosition += 10;
          }

          // Framework Structure
          if (script.frameworkStructure) {
            yPosition = addSectionHeader('Framework Structure');
            yPosition = addWrappedText(script.frameworkStructure, margin, yPosition, contentWidth, 10);
            yPosition += 10;
          }

          // Visual Suggestions
          if (script.visualSuggestions && script.visualSuggestions.length > 0) {
            yPosition = addSectionHeader('Visual Suggestions');
            
            doc.setFontSize(10);
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'normal');
            
            script.visualSuggestions.forEach((suggestion: string, index: number) => {
              yPosition = addWrappedText(`• ${suggestion}`, margin + 5, yPosition, contentWidth - 10, 10);
            });
            yPosition += 10;
          }

          // Technical Script with improved formatting
          if (script.technicalScript) {
            yPosition = addSectionHeader('Guión Cinematográfico Profesional');
            
            const technicalText = script.technicalScript;
            const lines = technicalText.split('\n').filter(line => line.trim());
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              
              // Check if we need a new page - more conservative spacing
              if (yPosition > pageHeight - 60) {
                doc.addPage();
                yPosition = 30;
              }
              
              // Scene separators - clean lines
              if (line.includes('═══')) {
                yPosition += 5;
                doc.setDrawColor(139, 92, 246);
                doc.setLineWidth(0.8);
                doc.line(margin, yPosition, margin + contentWidth, yPosition);
                yPosition += 10;
                continue;
              }
              
              // Scene numbers - prominent display
              if (line.match(/^ESCENA \d+/)) {
                yPosition += 10; // Extra space before scene
                doc.setFontSize(14);
                doc.setTextColor(139, 92, 246);
                doc.setFont('helvetica', 'bold');
                doc.text(line, margin, yPosition);
                yPosition += 15;
                continue;
              }
              
              // Sluglines - location headers
              if (line.match(/^SLUGLINE:/) || line.match(/^(INT\.|EXT\.)/)) {
                const cleanLine = line.replace('SLUGLINE: ', '').replace(/^(INT\.|EXT\.)/, '$1');
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text(cleanLine, margin, yPosition);
                yPosition += 12;
                continue;
              }
              
              // Timing information
              if (line.includes('TIMING:')) {
                doc.setFontSize(9);
                doc.setTextColor(120, 120, 120);
                doc.setFont('helvetica', 'italic');
                doc.text(line, margin, yPosition);
                yPosition += 10;
                continue;
              }
              
              // Section headers (technical categories)
              if (line.includes(':') && 
                  line.split(':')[0].toUpperCase() === line.split(':')[0] && 
                  line.length < 60 && 
                  !line.includes('http') &&
                  (line.includes('DESCRIPCIÓN') || line.includes('DIÁLOGO') || line.includes('ACOTACIONES'))) {
                doc.setFontSize(10);
                doc.setTextColor(60, 60, 60);
                doc.setFont('helvetica', 'bold');
                doc.text(line, margin, yPosition);
                yPosition += 10;
                continue;
              }
              
              // Dialogue with special formatting
              if (line.includes('(') && (line.includes('OFF') || line.includes('V.O.') || line.includes('eco'))) {
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 139);
                doc.setFont('helvetica', 'normal');
                yPosition = addWrappedText(line, margin + 20, yPosition, contentWidth - 40, 10);
                yPosition += 8;
                continue;
              }
              
              // Technical annotations and directions
              if (line.startsWith('-') || line.startsWith('•')) {
                doc.setFontSize(9);
                doc.setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'normal');
                yPosition = addWrappedText(line, margin + 15, yPosition, contentWidth - 30, 9);
                yPosition += 6;
                continue;
              }
              
              // Regular narrative text
              if (line.length > 0 && line.length < 250 && !line.includes('═')) {
                doc.setFontSize(9);
                doc.setTextColor(40, 40, 40);
                doc.setFont('helvetica', 'normal');
                yPosition = addWrappedText(line, margin + 8, yPosition, contentWidth - 16, 9);
                yPosition += 7;
              }
            }
            
            yPosition += 20;
          }

          // Viral Hashtags
          if (script.viralHashtags && script.viralHashtags.length > 0) {
            yPosition = addSectionHeader('Viral Hashtags');
            
            doc.setFontSize(10);
            doc.setTextColor(139, 92, 246);
            doc.setFont('helvetica', 'normal');
            
            const hashtagsText = script.viralHashtags.join(' ');
            yPosition = addWrappedText(hashtagsText, margin, yPosition, contentWidth, 10);
            yPosition += 10;
          }

          // Viral Adaptation Details
          if (script.adaptationDetails) {
            yPosition = addSectionHeader('Viral Adaptation Analysis');
            
            const adaptations = [
              { label: 'Hook Adaptation', value: script.adaptationDetails.hookAdaptation },
              { label: 'Tone Adaptation', value: script.adaptationDetails.toneAdaptation },
              { label: 'Language Adaptation', value: script.adaptationDetails.languageAdaptation },
              { label: 'Narrative Adaptation', value: script.adaptationDetails.narrativeAdaptation },
              { label: 'Key Phrases Adaptation', value: script.adaptationDetails.keyPhrasesAdaptation },
              { label: 'CTA Adaptation', value: script.adaptationDetails.ctaAdaptation }
            ];

            adaptations.forEach(adaptation => {
              if (adaptation.value && adaptation.value.trim() !== '') {
                // Sub-section header
                doc.setFontSize(11);
                doc.setTextColor(60, 60, 60);
                doc.setFont('helvetica', 'bold');
                doc.text(`${adaptation.label}:`, margin, yPosition);
                yPosition += 8;
                
                // Content
                doc.setFontSize(10);
                doc.setTextColor(30, 30, 30);
                doc.setFont('helvetica', 'normal');
                yPosition = addWrappedText(adaptation.value, margin + 5, yPosition, contentWidth - 10, 10);
                yPosition += 8;
              }
            });
          }
        }
      }

      // Professional Footer
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 30;
      }

      // Add final separator
      yPosition += 20;
      doc.setDrawColor(139, 92, 246);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Footer branding
      doc.setFontSize(10);
      doc.setTextColor(139, 92, 246);
      doc.setFont('helvetica', 'bold');
      doc.text('Generated by KimScript', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Transform Viral Videos into Marketing Gold', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Report generated on ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });

      // Add page numbers if multiple pages
      const totalPages = doc.getNumberOfPages();
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }
      }

      // Save the PDF
      const fileName = `kimscript-${type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Downloaded Successfully",
        description: `Report saved as ${fileName}`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToGoogleDocs = async () => {
    try {
      const content = type === 'analysis' 
        ? formatAnalysisForGoogleDocs(analysisResult)
        : formatScriptForGoogleDocs(analysisResult);

      // Create a data URL with the content
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // Download the text file that can be imported to Google Docs
      const a = document.createElement('a');
      a.href = url;
      a.download = `kimscript-${type}-${new Date().toISOString().split('T')[0]}.txt`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Open Google Docs in new tab
      const googleDocsUrl = 'https://docs.google.com/document/create';
      window.open(googleDocsUrl, '_blank');

      // Copy content to clipboard as backup
      await navigator.clipboard.writeText(content);

      toast({
        title: "Archivo descargado",
        description: "Archivo .txt descargado y Google Docs abierto. Contenido copiado al portapapeles.",
      });
    } catch (error) {
      toast({
        title: "Error en Google Docs",
        description: "No se pudo procesar la exportación",
        variant: "destructive",
      });
    }
  };

  const quickCopy = async () => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }

      const content = type === 'analysis' 
        ? formatAnalysisForCopy(analysisResult)
        : formatScriptForCopy(analysisResult);

      await navigator.clipboard.writeText(content);
      
      toast({
        title: "Contenido copiado",
        description: `${type === 'analysis' ? 'Análisis' : 'Guión'} copiado al portapapeles correctamente`,
      });
    } catch (error) {
      console.error('Copy error:', error);
      
      // Fallback method for older browsers
      try {
        const content = type === 'analysis' 
          ? formatAnalysisForCopy(analysisResult)
          : formatScriptForCopy(analysisResult);
        
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast({
          title: "Contenido copiado",
          description: "Texto copiado usando método alternativo",
        });
      } catch (fallbackError) {
        toast({
          title: "Error de copia",
          description: "No se pudo copiar al portapapeles. Intenta seleccionar y copiar manualmente.",
          variant: "destructive",
        });
      }
    }
  };

  const generateShareableLink = async () => {
    try {
      // Create a properly encoded shareable link
      const shareData = {
        id: analysisResult.id,
        videoUrl: analysisResult.videoUrl,
        platform: analysisResult.platform,
        transcription: analysisResult.transcription,
        analysis: analysisResult.analysis,
        generatedScript: analysisResult.generatedScript,
        createdAt: analysisResult.createdAt,
        shareType: type
      };
      
      // Encode the data safely for URL
      const encodedData = btoa(encodeURIComponent(JSON.stringify(shareData)));
      const shareUrl = `${window.location.origin}/share/${encodedData}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      // Show success message with preview
      toast({
        title: "Enlace generado correctamente",
        description: `Enlace copiado: ${shareUrl.substring(0, 50)}...`,
      });

      // Optional: Also show the link in a modal or alert for easy access
      setTimeout(() => {
        const confirmed = window.confirm(
          `Enlace para compartir generado:\n\n${shareUrl}\n\n¿Deseas abrirlo en una nueva pestaña para verificar?`
        );
        if (confirmed) {
          window.open(shareUrl, '_blank');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error al generar enlace",
        description: "No se pudo crear el enlace para compartir. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Quick Copy Button */}
      <Button
        onClick={quickCopy}
        variant="outline"
        size="sm"
        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-semibold"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copia Rápida
      </Button>

      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={isExporting}
            className="px-4 py-2 bg-gradient-to-r from-violet-50 to-blue-50 border-2 border-violet-200 text-violet-700 hover:border-violet-400 hover:bg-gradient-to-r hover:from-violet-100 hover:to-blue-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-semibold"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={generatePDF}>
            <File className="h-4 w-4 mr-2" />
            Exportar como PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToGoogleDocs}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir en Google Docs
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Button */}
      <Button
        onClick={generateShareableLink}
        variant="outline"
        size="sm"
        className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 hover:border-green-400 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-semibold"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Compartir
      </Button>
    </div>
  );
}

function formatAnalysisForExport(result: any) {
  return `
    <div class="header">
      <h1>Análisis de Video Viral - KimScript</h1>
      <p><strong>URL:</strong> ${result.videoUrl}</p>
      <p><strong>Plataforma:</strong> ${result.platform}</p>
    </div>
    
    <div class="section">
      <h3>Transcripción</h3>
      <div class="hook">${result.transcription}</div>
    </div>

    <div class="section">
      <h3>Hook Identificado</h3>
      <div class="metric">
        <strong>Hook:</strong> ${result.analysis.hook}<br>
        <strong>Tipo:</strong> ${result.analysis.hookType}<br>
        <strong>Efectividad:</strong> ${result.analysis.effectiveness}
      </div>
    </div>

    <div class="section">
      <h3>Elementos Virales</h3>
      <div class="metric">
        ${result.analysis.viralElements.map((element: string) => `<li>${element}</li>`).join('')}
      </div>
    </div>

    <div class="section">
      <h3>Análisis Psicológico</h3>
      <div class="metric">
        <strong>Triggers:</strong> ${result.analysis.psychologicalTriggers || 'N/A'}<br>
        <strong>Tono Emocional:</strong> ${result.analysis.emotionalTone}
      </div>
    </div>

    ${result.analysis.improvementRecommendations ? `
    <div class="section">
      <h3>Recomendaciones de Mejora</h3>
      ${result.analysis.improvementRecommendations.map((rec: string) => 
        `<div class="recommendation">${rec}</div>`
      ).join('')}
    </div>
    ` : ''}
  `;
}

function formatScriptForExport(result: any) {
  if (!result.generatedScript) return '<p>No hay script generado</p>';
  
  return `
    <div class="header">
      <h1>Guión Generado - KimScript</h1>
      <p><strong>Basado en:</strong> ${result.videoUrl}</p>
      <p><strong>Framework:</strong> ${result.generatedScript.framework || 'Personalizado'}</p>
    </div>

    <div class="section">
      <h3>Hook</h3>
      <div class="hook">${result.generatedScript.hook}</div>
    </div>

    <div class="section">
      <h3>Cuerpo del Guión</h3>
      <div class="metric">${result.generatedScript.body}</div>
    </div>

    <div class="section">
      <h3>Call to Action</h3>
      <div class="metric">${result.generatedScript.cta}</div>
    </div>

    <div class="section">
      <h3>Tono de Voz</h3>
      <div class="metric">${result.generatedScript.toneOfVoice}</div>
    </div>

    ${result.generatedScript.visualSuggestions ? `
    <div class="section">
      <h3>Sugerencias Visuales</h3>
      ${result.generatedScript.visualSuggestions.map((suggestion: string) => 
        `<div class="recommendation">${suggestion}</div>`
      ).join('')}
    </div>
    ` : ''}
  `;
}

function formatAnalysisForGoogleDocs(result: any) {
  return `ANÁLISIS DE VIDEO VIRAL - KIMSCRIPT

URL: ${result.videoUrl}
Plataforma: ${result.platform}
Fecha: ${new Date().toLocaleDateString('es-ES')}

TRANSCRIPCIÓN:
${result.transcription}

HOOK IDENTIFICADO:
• Hook: ${result.analysis.hook}
• Tipo: ${result.analysis.hookType}
• Efectividad: ${result.analysis.effectiveness}

ELEMENTOS VIRALES:
${result.analysis.viralElements.map((element: string) => `• ${element}`).join('\n')}

ANÁLISIS PSICOLÓGICO:
• Triggers Psicológicos: ${result.analysis.psychologicalTriggers || 'N/A'}
• Tono Emocional: ${result.analysis.emotionalTone}

${result.analysis.improvementRecommendations ? `
RECOMENDACIONES DE MEJORA:
${result.analysis.improvementRecommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}
` : ''}

---
Generado por KimScript - Plataforma de Análisis de Videos Virales`;
}

function formatScriptForGoogleDocs(result: any) {
  if (!result.generatedScript) return 'No hay script generado';
  
  return `GUIÓN GENERADO - KIMSCRIPT

Basado en: ${result.videoUrl}
Framework: ${result.generatedScript.framework || 'Personalizado'}
Fecha: ${new Date().toLocaleDateString('es-ES')}

HOOK:
${result.generatedScript.hook}

CUERPO DEL GUIÓN:
${result.generatedScript.body}

CALL TO ACTION:
${result.generatedScript.cta}

TONO DE VOZ:
${result.generatedScript.toneOfVoice}

${result.generatedScript.visualSuggestions ? `
SUGERENCIAS VISUALES:
${result.generatedScript.visualSuggestions.map((suggestion: string, index: number) => `${index + 1}. ${suggestion}`).join('\n')}
` : ''}

---
Generado por KimScript - Plataforma de Análisis de Videos Virales`;
}

function formatAnalysisForCopy(result: any) {
  return `🎬 ANÁLISIS DE VIDEO VIRAL - KIMSCRIPT

📍 URL: ${result.videoUrl}
📱 Plataforma: ${result.platform}

📝 TRANSCRIPCIÓN:
${result.transcription}

🎯 HOOK IDENTIFICADO:
• Hook: ${result.analysis.hook}
• Tipo: ${result.analysis.hookType}
• Efectividad: ${result.analysis.effectiveness}

⚡ ELEMENTOS VIRALES:
${result.analysis.viralElements.map((element: string) => `• ${element}`).join('\n')}

🧠 ANÁLISIS PSICOLÓGICO:
• Triggers: ${result.analysis.psychologicalTriggers || 'N/A'}
• Tono: ${result.analysis.emotionalTone}

${result.analysis.improvementRecommendations ? `
💡 RECOMENDACIONES:
${result.analysis.improvementRecommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}
` : ''}

---
Generado por KimScript 🚀`;
}

function formatScriptForCopy(result: any) {
  if (!result.generatedScript) return 'No hay script generado';
  
  return `🎬 GUIÓN GENERADO - KIMSCRIPT

📍 Basado en: ${result.videoUrl}
🎯 Framework: ${result.generatedScript.framework || 'Personalizado'}

🎪 HOOK:
${result.generatedScript.hook}

📝 CUERPO:
${result.generatedScript.body}

🚀 CALL TO ACTION:
${result.generatedScript.cta}

🎭 TONO DE VOZ:
${result.generatedScript.toneOfVoice}

${result.generatedScript.visualSuggestions ? `
🎨 SUGERENCIAS VISUALES:
${result.generatedScript.visualSuggestions.map((suggestion: string, index: number) => `${index + 1}. ${suggestion}`).join('\n')}
` : ''}

---
Generado por KimScript 🚀`;
}