import { SchemaEditor as Editor, SchemaEditorProps } from '@theguild/editor';
import { pascalCase } from 'change-case';
import { styles } from 'document-model-editors';
import { GraphQLSchema } from 'graphql';
import { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import codegen from '../common/codegen';
import {
    constrainedEditor,
    ConstrainedInstance,
    ConstrainedEditorRestriction,
} from 'constrained-editor-plugin';

export type ScopeType = 'global' | 'local';

interface IProps extends SchemaEditorProps {
    name: string;
    scope: ScopeType;
    onGenerate: (created: {
        documentName: string;
        schema: string;
        validator: () => z.AnyZodObject;
    }) => void;
    theme: styles.ColorTheme;
}

function getSchemaRestrictions(
    schema?: string,
    name?: string,
    scope?: ScopeType,
): undefined | ConstrainedEditorRestriction[] {
    const scopeStateName = scope === 'local' ? 'Local' : '';
    const inputDeclaration = `type ${pascalCase(name || '')}${scopeStateName}State`;

    if (!schema) return;

    // split schema into lines
    const lines = schema.split('\n');

    // get the line where the input declaration is contained
    const inputDeclarationLine = lines.find(line =>
        line.includes(inputDeclaration),
    );
    const inputDeclarationStartIndex =
        lines.findIndex(line => line.includes(inputDeclaration)) + 1;

    // if the input declaration is not found, return the schema as is with no restrictions
    if (!inputDeclarationLine) return;

    // get the position where the input declaration starts
    const inputDeclarationStart =
        inputDeclarationLine.indexOf(inputDeclaration) + 1;

    const lastLine = lines[lines.length - 1];

    return [
        {
            range: [1, 1, inputDeclarationStartIndex, inputDeclarationStart],
            allowMultiline: true,
        },
        {
            range: [
                inputDeclarationStartIndex,
                inputDeclaration.length + 1,
                lines.length,
                lastLine.length + 1,
            ],
            allowMultiline: true,
        },
    ];
}

const typeRegexp = /^type (\S*State)( })?/g;

const normalizeSchema = (
    schema: string | undefined,
    scope: ScopeType,
    documentName: string,
): string => {
    const scopeStateName = scope === 'local' ? 'Local' : '';
    const scopeSchemaContent = scope === 'global' ? ' {\n\t\n}' : '';

    if (!schema) {
        // Set initial code value if empty
        return `type ${pascalCase(
            documentName,
        )}${scopeStateName}State${scopeSchemaContent}`;
    }

    if (
        !schema.includes(
            `type ${pascalCase(documentName)}${scopeStateName}State {`,
        )
    ) {
        // Update type name value if name changed
        const newCodeValue = schema.replace(
            typeRegexp,
            (match, group1: string) => {
                return match.replace(
                    group1,
                    `${pascalCase(documentName)}${scopeStateName}State`,
                );
            },
        );

        return newCodeValue;
    }

    return schema || '';
};

export default function EditorSchema({
    name,
    onGenerate,
    theme,
    scope,
    value,
    ...props
}: IProps) {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const constrainedEditorRef = useRef<ConstrainedInstance | null>(null);
    const modelEditorRef = useRef<editor.ITextModel | null>(null);
    const [code, setCode] = useState(value || '');

    useEffect(() => {
        const normalizedSchema = normalizeSchema(value, scope, name);

        if (normalizedSchema !== code) {
            constrainedEditorRef.current?.removeRestrictionsIn(
                modelEditorRef.current,
            );

            setCode(normalizedSchema);

            setTimeout(() => {
                constrainedEditorRef.current?.addRestrictionsTo(
                    modelEditorRef.current,
                    getSchemaRestrictions(normalizedSchema, name, scope) || [],
                );
            }, 50);
        }
    }, [value, name]);

    const [schema, setSchema] = useState<GraphQLSchema>();
    const [validationSchema, setValidationSchema] =
        useState<() => z.AnyZodObject>();

    // const monaco = useMonaco();
    // const [completionProvider, setCompletionProvider] =
    //     useState<IDisposable | null>(null);
    // useEffect(() => {
    //     if (!monaco || !editorRef.current) {
    //         return;
    //     }
    //     if (completionProvider) {
    //         completionProvider.dispose();
    //     }

    //     const newProvider = monaco.languages.registerCompletionItemProvider(
    //         "graphql",
    //         {
    //             triggerCharacters: [":", "$", "\n", " ", "(", "@"],
    //             provideCompletionItems: async (model, position, context) => {
    //                 // const isUriEquals = model.uri.path === editorRef.current.path;
    //                 // if (!isUriEquals) {
    //                 //   return { suggestions: [] };
    //                 // }
    //                 languageService.updateSchema({
    //                     uri: model.uri.path,
    //                     schema,
    //                 });
    //                 const completionItems = languageService.getCompletion(
    //                     model.uri.path,
    //                     model.getValue(),
    //                     position as any
    //                 );

    //                 return {
    //                     incomplete: true,
    //                     suggestions: [
    //                         ...completionItems,
    //                         {
    //                             label: "String",
    //                             kind: 24,
    //                             insertText: "String",
    //                         },
    //                         {
    //                             label: "Int",
    //                             kind: 24,
    //                             insertText: "Int",
    //                         },
    //                     ],
    //                 };
    //             },
    //         }
    //     );
    //     setCompletionProvider(newProvider);
    // }, [monaco, editorRef.current, schema]);

    async function generateSchema(code: string, name: string) {
        // using callbacks instead of await due to rollup error
        codegen(code).then(result => {
            import(/* @vite-ignore */ result).then(validators => {
                const schemaName = `${name}StateSchema`;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                const validator = validators[schemaName];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                setValidationSchema(validator);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                onGenerate({ documentName: name, schema: code, validator });
            });
        });
    }

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }
        const listener = editorRef.current.onDidBlurEditorText(() => {
            const value = editorRef.current?.getValue();
            if (value) {
                generateSchema(value, name);
            } else {
                // TODO clear current schema?
            }
        });
        return () => listener.dispose();
    }, [name, editorRef.current]);

    return (
        <div>
            <Editor
                theme={`vs-${theme}`}
                onSchemaChange={schema => setSchema(schema)}
                width="100%"
                height="60vh"
                {...props}
                value={code}
                onChange={value => setCode(value ?? '')}
                onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    props.onMount?.(editor, monaco);

                    constrainedEditorRef.current = constrainedEditor(monaco);
                    modelEditorRef.current = editor.getModel();
                    constrainedEditorRef.current.initializeIn(editor);

                    constrainedEditorRef.current.addRestrictionsTo(
                        modelEditorRef.current,
                        getSchemaRestrictions(code, name, scope) || [],
                    );
                }}
                options={{
                    lineNumbers: 'off',
                    lineNumbersMinChars: 0,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    ...props.options,
                }}
            />
        </div>
    );
}
