import { FieldRow } from './FieldRow';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { FieldType } from '../App';

interface SchemaBuilderProps {
  schema: FieldType[];
  onSchemaChange: (schema: FieldType[]) => void;
}

export function SchemaBuilder({ schema, onSchemaChange }: SchemaBuilderProps) {
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addField = () => {
    const newField: FieldType = {
      id: generateId(),
      name: `field${schema.length + 1}`,
      type: 'String',
      defaultValue: 'Default String'
    };
    onSchemaChange([...schema, newField]);
  };

  const updateField = (fieldId: string, updatedField: FieldType) => {
    const updateFieldRecursive = (fields: FieldType[]): FieldType[] => {
      return fields.map(field => {
        if (field.id === fieldId) {
          return updatedField;
        }
        if (field.children) {
          return {
            ...field,
            children: updateFieldRecursive(field.children)
          };
        }
        return field;
      });
    };

    onSchemaChange(updateFieldRecursive(schema));
  };

  const deleteField = (fieldId: string) => {
    const deleteFieldRecursive = (fields: FieldType[]): FieldType[] => {
      return fields.filter(field => {
        if (field.id === fieldId) {
          return false;
        }
        if (field.children) {
          field.children = deleteFieldRecursive(field.children);
        }
        return true;
      });
    };

    onSchemaChange(deleteFieldRecursive(schema));
  };

  const addNestedField = (parentId: string) => {
    // Find the parent field to count its children
    const findParent = (fields: FieldType[]): FieldType | undefined => {
      for (const field of fields) {
        if (field.id === parentId) return field;
        if (field.children) {
          const found = findParent(field.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const parent = findParent(schema);
    const childCount = parent?.children?.length || 0;
    const newField: FieldType = {
      id: generateId(),
      name: `nested_field${childCount + 1}`,
      type: 'String',
      defaultValue: 'Default String'
    };

    const addNestedFieldRecursive = (fields: FieldType[]): FieldType[] => {
      return fields.map(field => {
        if (field.id === parentId) {
          return {
            ...field,
            children: [...(field.children || []), newField]
          };
        }
        if (field.children) {
          return {
            ...field,
            children: addNestedFieldRecursive(field.children)
          };
        }
        return field;
      });
    };

    onSchemaChange(addNestedFieldRecursive(schema));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Schema Fields</h2>
        </div>
        <Button 
          onClick={addField} 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      <div className="space-y-3">
        {schema.map((field, index) => (
          <FieldRow
            key={field.id}
            field={field}
            depth={0}
            onUpdate={updateField}
            onDelete={deleteField}
            onAddNested={addNestedField}
            isFirst={index === 0}
            isLast={index === schema.length - 1}
          />
        ))}
      </div>

      {schema.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No fields added yet</p>
          <Button onClick={addField} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Field
          </Button>
        </div>
      )}
    </div>
  );
}