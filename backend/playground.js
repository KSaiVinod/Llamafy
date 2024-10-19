// const Ajv = require('ajv');
// const ajv = new Ajv({ allErrors: true });
// ajv.addFormat('date', {
//     type: 'string',
//     validate: (dateString) => {
//         // Basic date validation regex for YYYY-MM-DD format
//         return /^\d{2}-\d{2}-\d{4}$/.test(dateString);
//     }
// });

// ajv.addFormat('base64', {
//     type: 'string',
//     validate: (base64String) => {
//         // This is a basic regex to validate a base64 string
//         return /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(
//             base64String
//         );
//     }
// });

// // Define the complete schema for flow components
// const schema = {
//     $schema: 'http://json-schema.org/draft-07/schema#',
//     type: 'object',
//     properties: {
//         version: {
//             type: 'string',
//             description: 'Version of the WhatsApp Flow template',
//             enum: ['1.0', '2.0', '3.0', '4.0', '5.0', '5.1']
//         },
//         components: {
//             type: 'array',
//             description: 'List of components in the flow',
//             items: {
//                 oneOf: [
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'TextInput' },
//                             name: { type: 'string' },
//                             label: { type: 'string', maxLength: 20 },
//                             'input-type': {
//                                 type: 'string',
//                                 enum: [
//                                     'text',
//                                     'number',
//                                     'email',
//                                     'password',
//                                     'passcode',
//                                     'phone'
//                                 ]
//                             },
//                             required: { type: 'boolean' },
//                             'helper-text': { type: 'string', maxLength: 80 },
//                             'min-chars': { type: 'integer' },
//                             'max-chars': { type: 'integer' },
//                             visible: { type: 'boolean' },
//                             'init-value': { type: 'string' }
//                         },
//                         required: ['type', 'name', 'label']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'TextArea' },
//                             name: { type: 'string' },
//                             label: { type: 'string', maxLength: 20 },
//                             'input-type': {
//                                 type: 'string',
//                                 enum: [
//                                     'text',
//                                     'number',
//                                     'email',
//                                     'password',
//                                     'passcode',
//                                     'phone'
//                                 ]
//                             },
//                             'helper-text': { type: 'string', maxLength: 80 },
//                             'max-length': { type: 'integer' },
//                             visible: { type: 'boolean' },
//                             enabled: { type: 'boolean' },
//                             'init-value': { type: 'string' }
//                         },
//                         required: ['type', 'name', 'label']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'TextBody' },
//                             text: { type: 'string' }
//                         },
//                         required: ['type', 'text']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'TextCaption' },
//                             text: { type: 'string' }
//                         },
//                         required: ['type', 'text']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'TextHeading' },
//                             text: { type: 'string' }
//                         },
//                         required: ['type', 'text']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'TextSubheading' },
//                             text: { type: 'string' }
//                         },
//                         required: ['type', 'text']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'OptIn' },
//                             name: { type: 'string' },
//                             label: { type: 'string' },
//                             required: { type: 'boolean' }
//                         },
//                         required: ['type', 'name', 'label']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'RadioButtonGroup' },
//                             name: { type: 'string' },
//                             label: { type: 'string', maxLength: 20 },
//                             description: { type: 'string', maxLength: 300 },
//                             enabled: { type: 'boolean' },
//                             required: { type: 'boolean' },
//                             visible: { type: 'boolean' },
//                             'init-value': {
//                                 type: 'array',
//                                 items: { type: 'string' }
//                             },
//                             'data-source': {
//                                 type: 'array',
//                                 items: {
//                                     type: 'object',
//                                     properties: {
//                                         id: { type: 'string' },
//                                         title: { type: 'string', maxLength: 30 }
//                                     },
//                                     required: ['id', 'title']
//                                 }
//                             }
//                         },
//                         required: ['type', 'name', 'label']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'Dropdown' },
//                             name: { type: 'string' },
//                             label: { type: 'string', maxLength: 20 },
//                             enabled: { type: 'boolean' },
//                             required: { type: 'boolean' },
//                             visible: { type: 'boolean' },
//                             'init-value': {
//                                 type: 'array',
//                                 items: { type: 'string' }
//                             },
//                             'data-source': {
//                                 type: 'array',
//                                 items: {
//                                     type: 'object',
//                                     properties: {
//                                         id: { type: 'string' },
//                                         title: { type: 'string', maxLength: 30 }
//                                     },
//                                     required: ['id', 'title']
//                                 }
//                             }
//                         },
//                         required: ['type', 'name', 'label']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'DatePicker' },
//                             name: { type: 'string' },
//                             label: { type: 'string' },
//                             'min-date': { type: 'string', format: 'date' },
//                             'max-date': { type: 'string', format: 'date' },
//                             'unavailable-dates': {
//                                 type: 'string',
//                                 format: 'date'
//                             },
//                             enabled: { type: 'boolean' },
//                             required: { type: 'boolean' },
//                             visible: { type: 'boolean' },
//                             'helper-text': { type: 'string', maxLength: 80 }
//                         },
//                         required: ['type', 'name', 'label']
//                     },
//                     {
//                         type: 'object',
//                         properties: {
//                             type: { type: 'string', const: 'Image' },
//                             src: { type: 'string', format: 'base64' },
//                             'alt-text': { type: 'string' },
//                             width: { type: 'integer', minimum: 0 },
//                             height: { type: 'integer', minimum: 0 },
//                             'scale-type': {
//                                 type: 'string',
//                                 enum: ['cover', 'contain']
//                             },
//                             'aspect-ratio': {
//                                 type: 'number',
//                                 minimum: 0.1,
//                                 maximum: 1
//                             }
//                         },
//                         required: ['type', 'src']
//                     }
//                 ]
//             }
//         }
//     },
//     required: ['version', 'components'],
//     additionalProperties: false
// };

// // Compile the schema with AJV
// const validate = ajv.compile(schema);

// // Function to validate WhatsApp flow component structure
// function validateFlowComponent(data) {
//     const valid = validate(data);
//     if (!valid) {
//         console.log('Validation errors:', validate.errors);
//         return false;
//     }
//     return true;
// }

// // Example data
// const flowData = {
//     version: '300',
//     components: [
//         {
//             type: 'TextInput',
//             name: 'user_name',
//             label: 'Enter your name',
//             'input-type': 'text',
//             required: true
//         },
//         {
//             type: 'RadioButtonGroup',
//             name: 'gender',
//             label: 'Select Gender',
//             'data-source': [
//                 { id: 'male', title: 'Male' },
//                 { id: 'female', title: 'Female' }
//             ],
//             required: true
//         }
//     ]
// };

// // Validate the example data
// const isValid = validateFlowComponent(flowData);
// console.log('Is the data valid?', isValid);

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

// Add custom formats for base64 and date
ajv.addFormat('base64', {
    type: 'string',
    validate: (base64String) => {
        return /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(
            base64String
        );
    }
});

ajv.addFormat('date', {
    type: 'string',
    validate: (dateString) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    }
});

// Define the complete schema for the flow JSON
const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'WhatsApp Flow Schema',
    type: 'object',
    properties: {
        version: {
            type: 'string',
            description: 'Version of the flow',
            enum: ['1.0', '2.0', '3.0', '3.1', '4.0', '5.0', '5.1']
        },
        screens: {
            type: 'array',
            description: 'List of screens in the flow',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    title: {
                        type: 'string'
                    },
                    data: {
                        type: 'object'
                    },
                    terminal: {
                        type: 'boolean',
                        default: false
                    },
                    layout: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                const: 'SingleColumnLayout'
                            },
                            children: {
                                type: 'array',
                                items: {
                                    oneOf: [
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'TextHeading'
                                                },
                                                text: {
                                                    type: 'string',
                                                    maxLength: 80,
                                                    minLength: 1
                                                }
                                            },
                                            required: ['type', 'text']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'TextSubheading'
                                                },
                                                text: {
                                                    type: 'string',
                                                    maxLength: 80,
                                                    minLength: 1
                                                }
                                            },
                                            required: ['type', 'text']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'TextCaption'
                                                },
                                                text: {
                                                    type: 'string',
                                                    maxLength: 409,
                                                    minLength: 1
                                                },
                                                'font-weight': {
                                                    type: 'string',
                                                    enum: [
                                                        'bold',
                                                        'italic',
                                                        'bold_italic',
                                                        'normal'
                                                    ]
                                                },
                                                strikethrough: {
                                                    type: 'boolean'
                                                },
                                                markdown: {
                                                    type: 'boolean',
                                                    default: false
                                                },
                                                visible: {
                                                    type: 'boolean',
                                                    default: true
                                                }
                                            },
                                            required: ['type', 'text']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'TextBody'
                                                },
                                                text: {
                                                    type: 'string',
                                                    maxLength: 4096,
                                                    minLength: 1
                                                },
                                                'font-weight': {
                                                    type: 'string',
                                                    enum: [
                                                        'bold',
                                                        'italic',
                                                        'bold_italic',
                                                        'normal'
                                                    ]
                                                },
                                                strikethrough: {
                                                    type: 'boolean'
                                                },
                                                markdown: {
                                                    type: 'boolean',
                                                    default: false
                                                }
                                            },
                                            required: ['type', 'text']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'RichText'
                                                },
                                                text: {
                                                    type: 'string'
                                                }
                                            },
                                            required: ['type', 'text']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'TextInput'
                                                },
                                                label: {
                                                    type: 'string',
                                                    maxLength: 20,
                                                    minLength: 1
                                                },
                                                'input-type': {
                                                    type: 'string',
                                                    enum: [
                                                        'text',
                                                        'number',
                                                        'email',
                                                        'password',
                                                        'passcode',
                                                        'phone'
                                                    ]
                                                },
                                                required: { type: 'boolean' },
                                                'helper-text': {
                                                    type: 'string',
                                                    maxLength: 80
                                                },
                                                'min-chars': {
                                                    type: 'integer',
                                                    minimum: 1
                                                },
                                                'max-chars': {
                                                    type: 'integer',
                                                    maximum: 80,
                                                    default: 80
                                                },
                                                visible: {
                                                    type: 'boolean',
                                                    default: true
                                                }
                                            },
                                            required: ['type', 'label']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'TextArea'
                                                },
                                                label: {
                                                    type: 'string',
                                                    maxLength: 20,
                                                    minLength: 1
                                                },
                                                required: { type: 'boolean' },
                                                'helper-text': {
                                                    type: 'string',
                                                    maxLength: 80
                                                },
                                                'max-length': {
                                                    type: 'integer',
                                                    default: 600
                                                },
                                                visible: {
                                                    type: 'boolean',
                                                    default: true
                                                }
                                            },
                                            required: ['type', 'label']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'CheckboxGroup'
                                                },
                                                label: {
                                                    type: 'string',
                                                    maxLength: 30,
                                                    minLength: 1
                                                },
                                                'data-source': {
                                                    type: 'array',
                                                    minItems: 1,
                                                    maxItems: 20,
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            id: {
                                                                type: 'string'
                                                            },
                                                            title: {
                                                                type: 'string',
                                                                maxLength: 30
                                                            }
                                                        }
                                                    }
                                                },
                                                'min-selected-items': {
                                                    type: 'integer'
                                                },
                                                'max-selected-items': {
                                                    type: 'integer'
                                                },
                                                required: { type: 'boolean' },
                                                enabled: { type: 'boolean' },
                                                visible: {
                                                    type: 'boolean',
                                                    default: true
                                                }
                                            },
                                            required: [
                                                'type',
                                                'label',
                                                'data-source'
                                            ]
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'RadioButtonsGroup'
                                                },
                                                label: {
                                                    type: 'string',
                                                    maxLength: 30,
                                                    minLength: 1
                                                },
                                                'data-source': {
                                                    type: 'array',
                                                    minItems: 1,
                                                    maxItems: 20,
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            id: {
                                                                type: 'string'
                                                            },
                                                            title: {
                                                                type: 'string',
                                                                maxLength: 30
                                                            }
                                                        }
                                                    }
                                                },
                                                required: { type: 'boolean' },
                                                enabled: { type: 'boolean' },
                                                visible: {
                                                    type: 'boolean',
                                                    default: true
                                                }
                                            },
                                            required: [
                                                'type',
                                                'label',
                                                'data-source'
                                            ]
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'Dropdown'
                                                },
                                                label: {
                                                    type: 'string',
                                                    maxLength: 20,
                                                    minLength: 1
                                                },
                                                'data-source': {
                                                    type: 'array',
                                                    minItems: 1,
                                                    maxItems: 200,
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            id: {
                                                                type: 'string'
                                                            },
                                                            title: {
                                                                type: 'string',
                                                                maxLength: 30
                                                            }
                                                        }
                                                    }
                                                },
                                                required: { type: 'boolean' },
                                                enabled: { type: 'boolean' },
                                                visible: {
                                                    type: 'boolean',
                                                    default: true
                                                }
                                            },
                                            required: [
                                                'type',
                                                'label',
                                                'name',
                                                'data-source'
                                            ]
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'DatePicker'
                                                },
                                                label: {
                                                    type: 'string',
                                                    maxLength: 40,
                                                    minLength: 1
                                                },
                                                'min-date': {
                                                    type: 'string',
                                                    format: 'date'
                                                },
                                                'max-date': {
                                                    type: 'string',
                                                    format: 'date'
                                                },
                                                'unavailable-dates': {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'date'
                                                    }
                                                },
                                                required: { type: 'boolean' },
                                                visible: {
                                                    type: 'boolean',
                                                    default: true
                                                }
                                            },
                                            required: ['type', 'label']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'Image'
                                                },
                                                src: {
                                                    type: 'string',
                                                    format: 'base64'
                                                },
                                                width: {
                                                    type: 'integer',
                                                    maximum: 2000
                                                },
                                                height: {
                                                    type: 'integer',
                                                    maximum: 2000
                                                },
                                                'scale-type': {
                                                    type: 'string',
                                                    enum: ['cover', 'contain'],
                                                    default: 'contain'
                                                },
                                                'aspect-ratio': {
                                                    type: 'number',
                                                    default: 1
                                                },
                                                'alt-text': {
                                                    type: 'string',
                                                    maxLength: 100
                                                }
                                            },
                                            required: [
                                                'type',
                                                'src',
                                                'alt-text'
                                            ]
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'TextArea'
                                                },
                                                label: {
                                                    type: 'string',
                                                    minLength: 1,
                                                    maxLength: 100
                                                },
                                                required: {
                                                    type: 'boolean'
                                                },
                                                name: {
                                                    type: 'string'
                                                }
                                            },
                                            required: ['type', 'label', 'name']
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    const: 'Footer'
                                                },
                                                label: {
                                                    type: 'string',
                                                    maxLength: 35,
                                                    minLength: 1
                                                },
                                                'left-caption': {
                                                    type: 'string',
                                                    maxLength: 15
                                                },
                                                'right-caption': {
                                                    type: 'string',
                                                    maxLength: 15
                                                },
                                                enabled: { type: 'boolean' },
                                                'on-click-action': {
                                                    type: 'object',
                                                    properties: {
                                                        name: {
                                                            type: 'string'
                                                        },
                                                        payload: {
                                                            type: 'object'
                                                        }
                                                    },
                                                    required: ['name']
                                                }
                                            },
                                            required: [
                                                'type',
                                                'label',
                                                'on-click-action'
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        required: ['type', 'children']
                    }
                },
                required: ['id', 'title', 'layout']
            }
        }
    },
    required: ['version', 'screens'],
    additionalProperties: false
};
// const schema = {
//     $schema: 'http://json-schema.org/draft-07/schema#',
//     title: 'WhatsApp Flow Schema',
//     type: 'object',
//     properties: {
//         version: {
//             type: 'string',
//             description: 'Version of the flow',
//             enum: ['1.0', '2.0', '3.0', '3.1', '4.0', '5.0', '5.1']
//         },
//         screens: {
//             type: 'array',
//             description: 'List of screens in the flow',
//             items: {
//                 type: 'object',
//                 properties: {
//                     id: { type: 'string' },
//                     title: { type: 'string' },
//                     data: { type: 'object' },
//                     terminal: { type: 'boolean', default: false },
//                     layout: {
//                         type: 'object',
//                         properties: {
//                             type: {
//                                 type: 'string',
//                                 const: 'SingleColumnLayout'
//                             },
//                             children: {
//                                 type: 'array',
//                                 items: {
//                                     oneOf: [
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'TextHeading'
//                                                 },
//                                                 text: {
//                                                     type: 'string',
//                                                     maxLength: 80,
//                                                     minLength: 1
//                                                 },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: ['type', 'text']
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'TextSubheading'
//                                                 },
//                                                 text: {
//                                                     type: 'string',
//                                                     maxLength: 80,
//                                                     minLength: 1
//                                                 },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: ['type', 'text']
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'TextBody'
//                                                 },
//                                                 text: {
//                                                     type: 'string',
//                                                     maxLength: 4096,
//                                                     minLength: 1
//                                                 },
//                                                 'font-weight': {
//                                                     type: 'string',
//                                                     enum: [
//                                                         'bold',
//                                                         'italic',
//                                                         'bold_italic',
//                                                         'normal'
//                                                     ]
//                                                 },
//                                                 strikethrough: {
//                                                     type: 'boolean'
//                                                 },
//                                                 markdown: {
//                                                     type: 'boolean',
//                                                     default: false
//                                                 },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: ['type', 'text']
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'TextCaption'
//                                                 },
//                                                 text: {
//                                                     type: 'string',
//                                                     maxLength: 409,
//                                                     minLength: 1
//                                                 },
//                                                 'font-weight': {
//                                                     type: 'string',
//                                                     enum: [
//                                                         'bold',
//                                                         'italic',
//                                                         'bold_italic',
//                                                         'normal'
//                                                     ]
//                                                 },
//                                                 strikethrough: {
//                                                     type: 'boolean'
//                                                 },
//                                                 markdown: {
//                                                     type: 'boolean',
//                                                     default: false
//                                                 },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: ['type', 'text']
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'RichText'
//                                                 },
//                                                 text: {
//                                                     type: 'array',
//                                                     items: { type: 'string' }
//                                                 },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: ['type', 'text']
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'TextEntry'
//                                                 },
//                                                 label: {
//                                                     type: 'string',
//                                                     maxLength: 20,
//                                                     minLength: 1
//                                                 },
//                                                 'input-type': {
//                                                     type: 'string',
//                                                     enum: [
//                                                         'text',
//                                                         'number',
//                                                         'email',
//                                                         'password',
//                                                         'passcode',
//                                                         'phone'
//                                                     ]
//                                                 },
//                                                 required: { type: 'boolean' },
//                                                 'helper-text': {
//                                                     type: 'string',
//                                                     maxLength: 80
//                                                 },
//                                                 'min-chars': {
//                                                     type: 'integer',
//                                                     minimum: 1
//                                                 },
//                                                 'max-chars': {
//                                                     type: 'integer',
//                                                     maximum: 80,
//                                                     default: 80
//                                                 },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: ['type', 'label']
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'CheckboxGroup'
//                                                 },
//                                                 label: {
//                                                     type: 'string',
//                                                     maxLength: 30,
//                                                     minLength: 1
//                                                 },
//                                                 'data-source': {
//                                                     type: 'array',
//                                                     minItems: 1,
//                                                     maxItems: 20,
//                                                     items: {
//                                                         type: 'object',
//                                                         properties: {
//                                                             id: {
//                                                                 type: 'string'
//                                                             },
//                                                             title: {
//                                                                 type: 'string',
//                                                                 maxLength: 30
//                                                             }
//                                                         }
//                                                     }
//                                                 },
//                                                 'min-selected-items': {
//                                                     type: 'integer'
//                                                 },
//                                                 'max-selected-items': {
//                                                     type: 'integer'
//                                                 },
//                                                 required: { type: 'boolean' },
//                                                 enabled: { type: 'boolean' },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: [
//                                                 'type',
//                                                 'label',
//                                                 'data-source'
//                                             ]
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'RadioButtonsGroup'
//                                                 },
//                                                 label: {
//                                                     type: 'string',
//                                                     maxLength: 30,
//                                                     minLength: 1
//                                                 },
//                                                 'data-source': {
//                                                     type: 'array',
//                                                     minItems: 1,
//                                                     maxItems: 20,
//                                                     items: {
//                                                         type: 'object',
//                                                         properties: {
//                                                             id: {
//                                                                 type: 'string'
//                                                             },
//                                                             title: {
//                                                                 type: 'string',
//                                                                 maxLength: 30
//                                                             }
//                                                         }
//                                                     }
//                                                 },
//                                                 required: { type: 'boolean' },
//                                                 enabled: { type: 'boolean' },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: [
//                                                 'type',
//                                                 'label',
//                                                 'data-source'
//                                             ]
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'Footer'
//                                                 },
//                                                 label: {
//                                                     type: 'string',
//                                                     maxLength: 35,
//                                                     minLength: 1
//                                                 },
//                                                 'left-caption': {
//                                                     type: 'string',
//                                                     maxLength: 15
//                                                 },
//                                                 'right-caption': {
//                                                     type: 'string',
//                                                     maxLength: 15
//                                                 },
//                                                 enabled: { type: 'boolean' },
//                                                 'on-click-action': {
//                                                     type: 'object',
//                                                     properties: {
//                                                         name: {
//                                                             type: 'string'
//                                                         },
//                                                         payload: {
//                                                             type: 'object'
//                                                         }
//                                                     },
//                                                     required: ['name']
//                                                 }
//                                             },
//                                             required: [
//                                                 'type',
//                                                 'label',
//                                                 'on-click-action'
//                                             ]
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'Dropdown'
//                                                 },
//                                                 label: {
//                                                     type: 'string',
//                                                     maxLength: 20,
//                                                     minLength: 1
//                                                 },
//                                                 'data-source': {
//                                                     type: 'array',
//                                                     minItems: 1,
//                                                     maxItems: 200,
//                                                     items: {
//                                                         type: 'object',
//                                                         properties: {
//                                                             id: {
//                                                                 type: 'string'
//                                                             },
//                                                             title: {
//                                                                 type: 'string',
//                                                                 maxLength: 30
//                                                             }
//                                                         }
//                                                     }
//                                                 },
//                                                 required: { type: 'boolean' },
//                                                 enabled: { type: 'boolean' },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: [
//                                                 'type',
//                                                 'label',
//                                                 'data-source'
//                                             ]
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'DatePicker'
//                                                 },
//                                                 label: {
//                                                     type: 'string',
//                                                     maxLength: 40,
//                                                     minLength: 1
//                                                 },
//                                                 'min-date': {
//                                                     type: 'string',
//                                                     format: 'date'
//                                                 },
//                                                 'max-date': {
//                                                     type: 'string',
//                                                     format: 'date'
//                                                 },
//                                                 'unavailable-dates': {
//                                                     type: 'array',
//                                                     items: {
//                                                         type: 'string',
//                                                         format: 'date'
//                                                     }
//                                                 },
//                                                 required: { type: 'boolean' },
//                                                 visible: {
//                                                     type: 'boolean',
//                                                     default: true
//                                                 }
//                                             },
//                                             required: ['type', 'label']
//                                         },
//                                         {
//                                             type: 'object',
//                                             properties: {
//                                                 type: {
//                                                     type: 'string',
//                                                     const: 'Image'
//                                                 },
//                                                 src: {
//                                                     type: 'string',
//                                                     format: 'base64'
//                                                 },
//                                                 width: {
//                                                     type: 'integer',
//                                                     maximum: 2000
//                                                 },
//                                                 height: {
//                                                     type: 'integer',
//                                                     maximum: 2000
//                                                 },
//                                                 'scale-type': {
//                                                     type: 'string',
//                                                     enum: ['cover', 'contain'],
//                                                     default: 'contain'
//                                                 },
//                                                 'aspect-ratio': {
//                                                     type: 'number',
//                                                     default: 1
//                                                 },
//                                                 'alt-text': {
//                                                     type: 'string',
//                                                     maxLength: 100
//                                                 }
//                                             },
//                                             required: [
//                                                 'type',
//                                                 'src',
//                                                 'alt-text'
//                                             ]
//                                         }
//                                     ]
//                                 }
//                             }
//                         },
//                         required: ['type', 'children']
//                     }
//                 },
//                 required: ['id', 'title', 'layout']
//             }
//         }
//     },
//     required: ['version', 'screens']
//     // additionalProperties: false
// };

// Compile the schema with AJV
const validate = ajv.compile(schema);

// Function to validate flow JSON structure
function validateFlow(data) {
    const valid = validate(data);
    if (!valid) {
        console.log('Validation errors:', validate.errors);
        return false;
    }
    return true;
}

// Example data (the provided flow JSON)
const flowData = {
    version: '5.1',
    screens: [
        {
            id: 'RATE',
            title: 'Feedback 1 of 2',
            data: {},
            layout: {
                type: 'SingleColumnLayout',
                children: [
                    {
                        type: 'TextSubheading',
                        text: 'Rate the following: '
                    },
                    {
                        type: 'Dropdown',
                        label: 'Booking experience',
                        required: true,
                        name: 'purchase_rating',
                        'data-source': [
                            {
                                id: '0_★★★★★_•_Excellent_(5/5)',
                                title: '★★★★★ • Excellent (5/5)'
                            },
                            {
                                id: '1_★★★★☆_•_Good_(4/5)',
                                title: '★★★★☆ • Good (4/5)'
                            },
                            {
                                id: '2_★★★☆☆_•_Average_(3/5)',
                                title: '★★★☆☆ • Average (3/5)'
                            },
                            {
                                id: '3_★★☆☆☆_•_Poor_(2/5)',
                                title: '★★☆☆☆ • Poor (2/5)'
                            },
                            {
                                id: '4_★☆☆☆☆_•_Very_Poor_(1/5)',
                                title: '★☆☆☆☆ • Very Poor (1/5)'
                            }
                        ]
                    },
                    {
                        type: 'Dropdown',
                        label: 'Cleanliness',
                        required: true,
                        name: 'delivery_rating',
                        'data-source': [
                            {
                                id: '0_★★★★★_•_Excellent_(5/5)',
                                title: '★★★★★ • Excellent (5/5)'
                            },
                            {
                                id: '1_★★★★☆_•_Good_(4/5)',
                                title: '★★★★☆ • Good (4/5)'
                            },
                            {
                                id: '2_★★★☆☆_•_Average_(3/5)',
                                title: '★★★☆☆ • Average (3/5)'
                            },
                            {
                                id: '3_★★☆☆☆_•_Poor_(2/5)',
                                title: '★★☆☆☆ • Poor (2/5)'
                            },
                            {
                                id: '4_★☆☆☆☆_•_Very_Poor_(1/5)',
                                title: '★☆☆☆☆ • Very Poor (1/5)'
                            }
                        ]
                    },
                    {
                        type: 'Dropdown',
                        label: 'Customer service',
                        required: true,
                        name: 'cs_rating',
                        'data-source': [
                            {
                                id: '0',
                                title: '★★★★★ • Excellent (5/5)'
                            },
                            {
                                id: '1',
                                title: '★★★★☆ • Good (4/5)'
                            },
                            {
                                id: '2',
                                title: '★★★☆☆ • Average (3/5)'
                            },
                            {
                                id: '3',
                                title: '★★☆☆☆ • Poor (2/5)'
                            },
                            {
                                id: '4',
                                title: '★☆☆☆☆ • Very Poor (1/5)'
                            }
                        ]
                    },
                    {
                        type: 'Footer',
                        label: 'Done',
                        'on-click-action': {
                            name: 'navigate',
                            next: {
                                type: 'screen',
                                name: 'RECOMMEND'
                            },
                            payload: {
                                screen_0_purchase_0: '${form.purchase_rating}',
                                screen_0_delivery_1: '${form.delivery_rating}',
                                screen_0_cs_2: '${form.cs_rating}'
                            }
                        }
                    }
                ]
            }
        },
        {
            id: 'RECOMMEND',
            title: 'Feedback 2 of 2',
            data: {
                screen_0_purchase_0: {
                    type: 'string',
                    __example__: 'Example'
                },
                screen_0_delivery_1: {
                    type: 'string',
                    __example__: 'Example'
                },
                screen_0_cs_2: {
                    type: 'string',
                    __example__: 'Example'
                }
            },
            terminal: true,
            layout: {
                type: 'SingleColumnLayout',
                children: [
                    {
                        type: 'TextSubheading',
                        text: 'How could we do better?'
                    },
                    {
                        type: 'TextArea',
                        label: 'Feedback if any',
                        required: true,
                        name: 'TextArea_6ed9dc'
                    },
                    {
                        type: 'Footer',
                        label: 'Continue',
                        'on-click-action': {
                            name: 'complete',
                            payload: {
                                screen_1_TextArea_0: '${form.TextArea_6ed9dc}',
                                screen_0_purchase_0:
                                    '${data.screen_0_purchase_0}',
                                screen_0_delivery_1:
                                    '${data.screen_0_delivery_1}',
                                screen_0_cs_2: '${data.screen_0_cs_2}'
                            }
                        }
                    }
                ]
            }
        }
    ]
};

const ekaCareFlow = {
    version: '4.0',
    screens: [
        {
            id: 'EC_QUESTIONNAIRE_SCREEN',
            layout: {
                type: 'SingleColumnLayout',
                children: [
                    {
                        type: 'TextCaption',
                        text: 'Has your child received all the vaccines as per age?'
                    },
                    {
                        type: 'Dropdown',
                        name: 'received_all_vaccines',
                        label: 'Vaccination Status',
                        required: true,
                        'data-source': [
                            {
                                id: 'yes',
                                title: 'Yes'
                            },
                            {
                                id: 'no',
                                title: 'No'
                            },
                            {
                                id: 'partially',
                                title: 'Partially'
                            }
                        ]
                    },
                    {
                        type: 'TextCaption',
                        text: 'What is your child’s weight?'
                    },
                    {
                        type: 'TextInput',
                        label: 'Enter weight(in kgs)',
                        name: 'child_weight',
                        required: true,
                        'input-type': 'number'
                    },
                    {
                        type: 'TextCaption',
                        text: 'What is your child’s height?'
                    },
                    {
                        type: 'TextInput',
                        label: 'Enter height(in cm)',
                        name: 'child_height',
                        'input-type': 'number',
                        required: true
                    },
                    {
                        type: 'TextCaption',
                        text: 'Is there a family history of any of the following conditions?'
                    },
                    {
                        type: 'CheckboxGroup',
                        name: 'family_conditions',
                        required: false,
                        'data-source': [
                            {
                                id: 'none',
                                title: 'None'
                            },
                            {
                                id: 'obesity',
                                title: 'Obesity'
                            },
                            {
                                id: 'hypertension/high_bp',
                                title: 'Hypertension / High BP'
                            },
                            {
                                id: 'diabetes',
                                title: 'Diabetes'
                            },
                            {
                                id: 'asthma',
                                title: 'Asthma'
                            },
                            {
                                id: 'mental_health',
                                title: 'Mental health desease'
                            }
                        ],
                        label: 'Family history'
                    },
                    {
                        type: 'TextCaption',
                        text: 'Does your child have any drug allergy?'
                    },
                    {
                        type: 'Dropdown',
                        label: 'Drug Allergy',
                        name: 'drug_allergy',
                        required: true,
                        'data-source': [
                            {
                                id: 'yes',
                                title: 'Yes'
                            },
                            {
                                id: 'no',
                                title: 'No'
                            }
                        ]
                    },
                    {
                        type: 'TextCaption',
                        text: 'Does your child have any food allergy?'
                    },
                    {
                        type: 'Dropdown',
                        label: 'Food Allergy',
                        name: 'food_allergy',
                        required: true,
                        'data-source': [
                            {
                                id: 'yes',
                                title: 'Yes'
                            },
                            {
                                id: 'no',
                                title: 'No'
                            }
                        ]
                    },
                    {
                        type: 'Footer',
                        label: 'Complete',
                        'on-click-action': {
                            name: 'complete',
                            payload: {
                                received_all_vaccines:
                                    '${form.received_all_vaccines}',
                                child_weight: '${form.child_weight}',
                                child_height: '${form.child_height}',
                                family_conditions: '${form.family_conditions}',
                                drug_allergy: '${form.drug_allergy}',
                                food_allergy: '${form.food_allergy}',
                                template: 'ekacare_child_questionnaire'
                            }
                        }
                    }
                ]
            },
            title: 'Questionnaire Form',
            terminal: true,
            success: true,
            data: {}
        }
    ]
};

// Validate the example flow data
const isValid = validateFlow(ekaCareFlow);
console.log('Is the data valid?', isValid);
