import { useState } from 'react';
import { SchemaBuilder } from './components/SchemaBuilder';
import { JsonPreview } from './components/JsonPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FieldType {
  id: string;
  name: string;
  type: 'String' | 'Number' | 'Nested' | 'ObjectId' | 'Float' | 'Boolean';
  defaultValue?: string | number | boolean;
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
      <div className="w-full flex justify-center px-0">
        <Card className="shadow-xl w-full max-w-full mx-auto">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg w-full">
            <CardTitle className="text-3xl font-bold">JSON Schema Builder</CardTitle>
            <p className="text-blue-100 mt-2">Build dynamic JSON schemas with nested field support</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <SchemaBuilder schema={schema} onSchemaChange={setSchema} />
              </div>
              <div>
                <JsonPreview schema={schema} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;