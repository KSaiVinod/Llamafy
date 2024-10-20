const EXAMPLE_JSON = {
  version: '5.1',
  screens: [
    {
      id: 'WELCOME_SCREEN',
      layout: {
        type: 'SingleColumnLayout',
        children: [
          {
            type: 'Image',
            src: '${data.image}',
            height: 280
          },
          {
            type: 'TextHeading',
            text: 'Chocolate Berry Cake 500g'
          },
          {
            type: 'TextBody',
            markdown: true,
            text: '+ Category: **Premium Cake** \n+ Region: **South Zone**\n+ Type: **Make to Order**\n+ KPT: 30 Mins\n+ Weight: 640g'
          },
          {
            type: 'TextSubheading',
            text: 'Ingredients'
          },
          {
            type: 'TextBody',
            markdown: true,
            text: '**Layer**\n+ 3 layers chocolate sponge: 75g+75g+75g\n+ Suger syrup: 20g+20g+20g for each layer\n+ Belgium Truffle(for layering): 50g+50g\n\n**Filling**\n+ Mixed berry filling-Chopped (for layering): 20g+20g: (20g strawberry fruit filling+20g blueberry fruit filling)\n**Covering cake sides**\n+ Belgium Truffle (for rough + final finishing): 57g +43g\n**Top garnish**\n+ Mixed berry filling: 25g: (12.5g Chopped strawberry filling+12.5g blueberry fruit filling)\n+ Belgium Truffle Mousse (for piping) (T16): 40g\n+ Gold leaves: 0.1g\n**Side garnish**\n+ (50g Belgium Truffle+13g whipped cream) - (this is the garnish on the sides, chocolate mousse drops)\n+ Dark Compound (Band garnish): 45g (side chocolate covering of cake)\n**Secure cake**\n+ Cake gel (on base): 5g (to secure cake to the base)\n+ Dowel (2 inch): 1 pc: to be placed on the cake'
          },
          {
            type: 'Footer',
            label: 'Continue',
            'on-click-action': {
              name: 'navigate',
              next: {
                name: 'QUIZ_SCREEN',
                type: 'screen'
              },
              payload: {}
            }
          }
        ]
      },
      title: 'Recipe',
      data: {
        image: {
          type: 'string',
          __example__:
            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAAhKDveksOjmAAAAAElFTkSuQmCC'
        },
        question1: {
          type: 'string',
          __example__: 'How many grams of chocolate sponge are used in the recipe?'
        },
        options1: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              title: {
                type: 'string'
              }
            }
          },
          __example__: [
            {
              id: 'a',
              title: '150g'
            },
            {
              id: 'b',
              title: '220g'
            },
            {
              id: 'c',
              title: '75g + 75g + 75g'
            },
            {
              id: 'd',
              title: '250g'
            }
          ]
        },
        options2: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              title: {
                type: 'string'
              }
            }
          },
          __example__: [
            {
              id: 'a',
              title: 'Chocolate sponge'
            },
            {
              id: 'b',
              title: 'Mixed berry filling'
            },
            {
              id: 'c',
              title: 'Suger syrup'
            },
            {
              id: 'd',
              title: 'Dark compound'
            }
          ]
        },
        options3: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              title: {
                type: 'string'
              }
            }
          },
          __example__: [
            {
              id: 'a',
              title: 'Decoration'
            },
            {
              id: 'b',
              title: 'Structural support'
            },
            {
              id: 'c',
              title: 'Flavor enhancement'
            },
            {
              id: 'd',
              title: 'Moisture retention'
            }
          ]
        },
        options4: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              title: {
                type: 'string'
              }
            }
          },
          __example__: [
            {
              id: 'a',
              title: '20g'
            },
            {
              id: 'b',
              title: '25g'
            },
            {
              id: 'c',
              title: '30g'
            },
            {
              id: 'd',
              title: '40g'
            }
          ]
        },
        options5: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              title: {
                type: 'string'
              }
            }
          },
          __example__: [
            {
              id: 'a',
              title: 'Chocolate sponge'
            },
            {
              id: 'b',
              title: 'Mixed berry filling'
            },
            {
              id: 'c',
              title: 'Suger syrup'
            },
            {
              id: 'd',
              title: 'Dark compound'
            }
          ]
        },
        options6: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              title: {
                type: 'string'
              }
            }
          },
          __example__: [
            {
              id: 'a',
              title: 'Belgium truffle'
            },
            {
              id: 'b',
              title: 'Dark compound'
            },
            {
              id: 'c',
              title: 'Suger syrup'
            },
            {
              id: 'd',
              title: 'Cake gel'
            }
          ]
        }
      }
    },
    {
      title: 'Questions',
      id: 'QUIZ_SCREEN',
      terminal: true,
      success: true,
      data: {},
      layout: {
        type: 'SingleColumnLayout',
        children: [
          {
            type: 'RadioButtonsGroup',
            name: 'question_1',
            'data-source': '${screen.WELCOME_SCREEN.data.options1}',
            label: 'How many grams of chocolate sponge are used in the recipe?',
            required: true
          },
          {
            type: 'RadioButtonsGroup',
            name: 'question_2',
            'data-source': '${screen.WELCOME_SCREEN.data.options2}',
            label: 'Which ingredient is used for layering alongside Belgium Truffle?',
            required: true
          },
          {
            type: 'RadioButtonsGroup',
            name: 'question_3',
            'data-source': '${screen.WELCOME_SCREEN.data.options3}',
            label: 'What is the purpose of the dowel in the recipe?',
            required: true
          },
          {
            type: 'RadioButtonsGroup',
            name: 'question_4',
            'data-source': '${screen.WELCOME_SCREEN.data.options4}',
            label: 'How much berry filling is used for garnish?',
            required: true
          },
          {
            type: 'RadioButtonsGroup',
            name: 'question_5',
            'data-source': '${screen.WELCOME_SCREEN.data.options5}',
            label: 'What is used for piping in the recipe?',
            required: true
          },
          {
            type: 'RadioButtonsGroup',
            name: 'question_6',
            'data-source': '${screen.WELCOME_SCREEN.data.options6}',
            label: 'Which ingredient is used for band garnish?',
            required: true
          },
          {
            type: 'Footer',
            label: 'Finish',
            'on-click-action': {
              name: 'complete',
              payload: {
                user_response: {
                  q1: '${form.question1}',
                  q2: '${form.question2}',
                  q3: '${form.question3}',
                  q4: '${form.question4}',
                  q5: '${form.question5}',
                  q6: '${form.question6}'
                }
              }
            }
          }
        ]
      }
    }
  ]
}

module.exports = EXAMPLE_JSON
