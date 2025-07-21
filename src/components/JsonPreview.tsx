import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Eye } from 'lucide-react';
import { FieldType } from '../App';
import { toast } from 'sonner';

interface JsonPreviewProps {
  schema: FieldType[];
}

export function JsonPreview({ schema }: JsonPreviewProps) {
  const convertSchemaToJson = (fields: FieldType[]): Record<string, any> => {
    const result: Record<string, any> = {};
    
    fields.forEach(field => {
      if (!field.enabled) return;
      if (field.type === 'Nested' && field.children) {
        const nested = convertSchemaToJson(field.children);
        if (Object.keys(nested).length > 0) {
          result[field.name] = nested;
        }
      } else {
        result[field.name] = field.defaultValue ?? '';
      }
    });
    
    return result;
  };

  const jsonOutput = convertSchemaToJson(schema);
  const jsonString = JSON.stringify(jsonOutput, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      toast.success('JSON copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy JSON');
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('JSON file downloaded!');
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-green-600" />
              <CardTitle className="text-xl text-gray-800">Live JSON Preview</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadJson}
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto">
            <pre className="p-6 whitespace-pre-wrap break-words">
              {jsonString || '{}'}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Schema Statistics */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{schema.length}</div>
              <div className="text-sm text-gray-600">Root Fields</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {schema.filter(f => f.type === 'Nested').length}
              </div>
              <div className="text-sm text-gray-600">Nested Objects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {JSON.stringify(jsonOutput).length}
              </div>
              <div className="text-sm text-gray-600">JSON Size (bytes)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}