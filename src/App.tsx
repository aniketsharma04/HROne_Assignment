import { useState } from 'react';
import { SchemaBuilder } from './components/SchemaBuilder';
import { JsonPreview } from './components/JsonPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FieldType {
  id: string;
  name: string;
  type: 'String' | 'Number' | 'Nested';
  defaultValue?: string | number;
  children?: FieldType[];
}

function App() {
  const [schema, setSchema] = useState<FieldType[]>([
    {
      id: '1',
      name: 'field1',
      type: 'String',
      defaultValue: 'Default String'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">JSON Schema Builder</CardTitle>
            <p className="text-blue-100 mt-2">Build dynamic JSON schemas with nested field support</p>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="builder" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="builder" className="text-lg">Schema Builder</TabsTrigger>
                <TabsTrigger value="preview" className="text-lg">JSON Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="builder" className="space-y-4">
                <SchemaBuilder schema={schema} onSchemaChange={setSchema} />
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                <JsonPreview schema={schema} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;