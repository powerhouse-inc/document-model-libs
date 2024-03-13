import { ConstrainedEditorRestriction } from 'constrained-editor-plugin';
import { ScopeType } from './editor-schema';
import { pascalCase } from 'change-case';
import { IProps } from './editor-operation';

type InputCodeReference = {
    inputDeclarationLineIndex: number;
    inputDeclarationColStartIndex: number;
    lastLine: string;
    lines: string[];
};

export function getInputCodeReference(
    input: string,
    schema?: string,
): InputCodeReference | null {
    if (!schema) return null;

    // split schema into lines
    const lines = schema.split('\n');

    // get the line where the input declaration is contained
    const inputDeclarationLine = lines.find(line => line.includes(input));
    const inputDeclarationLineIndex =
        lines.findIndex(line => line.includes(input)) + 1;

    // if the input declaration is not found, return the schema as is with no restrictions
    if (!inputDeclarationLine) return null;

    // get the position where the input declaration starts
    const inputDeclarationColStartIndex =
        inputDeclarationLine.indexOf(input) + 1;

    const lastLine = lines[lines.length - 1];

    return {
        inputDeclarationLineIndex,
        inputDeclarationColStartIndex,
        lastLine,
        lines,
    };
}

export function getStateSchemaRestrictions(
    schema?: string,
    name?: string,
    scope?: ScopeType,
): ConstrainedEditorRestriction[] {
    const scopeStateName = scope === 'local' ? 'Local' : '';
    const inputDeclaration = `type ${pascalCase(name || '')}${scopeStateName}State`;

    const inputCodeReference = getInputCodeReference(inputDeclaration, schema);
    if (!inputCodeReference) return [];

    const {
        lines,
        lastLine,
        inputDeclarationLineIndex,
        inputDeclarationColStartIndex,
    } = inputCodeReference;

    return [
        {
            range: [
                1,
                1,
                inputDeclarationLineIndex,
                inputDeclarationColStartIndex,
            ],
            allowMultiline: true,
        },
        {
            range: [
                inputDeclarationLineIndex,
                inputDeclaration.length + 1,
                lines.length,
                lastLine.length + 1,
            ],
            allowMultiline: true,
        },
    ];
}

type SchemaAndRestrictionsType = {
    schema: string;
    restrictions?: ConstrainedEditorRestriction[];
};

export const getSchemaAndRestrictions = (
    schema: IProps['schema'],
    name: IProps['name'],
): SchemaAndRestrictionsType => {
    const inputDeclaration = `input ${pascalCase(name || '')}Input {`;

    if (!schema) {
        return {
            restrictions: [
                {
                    range: [1, 1, 1, 1],
                    allowMultiline: true,
                },
                {
                    range: [2, 1, 6, 1],
                    allowMultiline: true,
                },
            ],
            schema: `${inputDeclaration}
    # add your code here
}

# add new types here
`,
        };
    }

    const inputCodeReference = getInputCodeReference(inputDeclaration, schema);
    if (!inputCodeReference) {
        return {
            restrictions: undefined,
            schema,
        };
    }

    const { lines, inputDeclarationLineIndex, inputDeclarationColStartIndex } =
        inputCodeReference;

    return {
        schema,
        restrictions: [
            {
                range: [
                    1,
                    1,
                    inputDeclarationLineIndex,
                    inputDeclarationColStartIndex,
                ],
                allowMultiline: true,
            },
            {
                range: [inputDeclarationLineIndex + 1, 1, lines.length, 1],
                allowMultiline: true,
            },
        ],
    };
};
