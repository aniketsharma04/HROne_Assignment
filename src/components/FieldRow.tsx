import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { FieldType } from '../App';

interface FieldRowProps {
  field: FieldType;
  depth: number;
  onUpdate: (fieldId: string, updatedField: FieldType) => void;
  onDelete: (fieldId: string) => void;
  onAddNested: (parentId: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function FieldRow({ 
  field, 
  depth, 
  onUpdate, 
  onDelete, 
  onAddNested,
  isFirst = false,
  isLast = false 
}: FieldRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleNameChange = (name: string) => {
    onUpdate(field.id, { ...field, name });
  };

  const handleTypeChange = (type: 'String' | 'Number' | 'Nested' | 'ObjectId' | 'Float' | 'Boolean') => {
    let defaultValue: string | number | boolean | undefined;
    let children: FieldType[] | undefined;

    switch (type) {
      case 'String':
        defaultValue = 'Default String';
        children = undefined;
        break;
      case 'Number':
        defaultValue = 0;
        children = undefined;
        break;
      case 'ObjectId':
        defaultValue = 'ObjectId';
        children = undefined;
        break;
      case 'Float':
        defaultValue = 0.0;
        children = undefined;
        break;
      case 'Boolean':
        defaultValue = false;
        children = undefined;
        break;
      case 'Nested':
        defaultValue = undefined;
        children = [];
        break;
    }

    onUpdate(field.id, { ...field, type, defaultValue, children });
  };

  const handleDefaultValueChange = (value: string) => {
    const defaultValue = field.type === 'Number' ? Number(value) || 0 : value;
    onUpdate(field.id, { ...field, defaultValue });
  };

  const marginLeft = depth * 24;

  return (
    <div style={{ marginLeft: `${marginLeft}px` }}>
      <Card className={`transition-all duration-200 hover:shadow-md ${
        depth > 0 ? 'bg-gray-50 border-l-4 border-l-blue-300' : 'bg-white'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {field.type === 'Nested' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 h-8 w-8"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}

            <div className="flex-1 grid grid-cols-12 gap-3 items-center">
              {/* Field Name */}
              <div className="col-span-3">
                <Input
                  value={field.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Field name"
                  className="font-medium"
                />
              </div>

              {/* Field Type */}
              <div className="col-span-3">
                <Select value={field.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nested">Nested</SelectItem>
                    <SelectItem value="String">String</SelectItem>
                    <SelectItem value="Number">Number</SelectItem>
                    <SelectItem value="ObjectId">ObjectId</SelectItem>
                    <SelectItem value="Float">Float</SelectItem>
                    <SelectItem value="Boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Default Value (only for String and Number) */}
              <div className="col-span-4">
                {field.type !== 'Nested' && (
                  <Input
                    value={field.defaultValue?.toString() || ''}
                    onChange={(e) => handleDefaultValueChange(e.target.value)}
                    placeholder={field.type === 'Number' ? '0' : 'Default value'}
                    type={field.type === 'Number' ? 'number' : 'text'}
                  />
                )}
                {field.type === 'Nested' && (
                  <div className="text-sm text-gray-500 italic py-2">
                    Nested object
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex gap-2 justify-end">
                {field.type === 'Nested' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddNested(field.id)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(field.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested Children */}
      {field.type === 'Nested' && field.children && isExpanded && (
        <div className="mt-3 space-y-3">
          {field.children.map((child, index) => (
            <FieldRow
              key={child.id}
              field={child}
              depth={depth + 1}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddNested={onAddNested}
              isFirst={index === 0}
              isLast={index === (field.children?.length || 0) - 1}
            />
          ))}
          {field.children.length === 0 && (
            <div 
              className="text-center py-6 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
              style={{ marginLeft: '24px' }}
            >
              <p className="text-gray-500 text-sm mb-2">No nested fields</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddNested(field.id)}
                className="text-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Nested Field
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}