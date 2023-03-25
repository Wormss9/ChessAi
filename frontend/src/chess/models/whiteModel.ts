import { ModelAndWeightsConfig } from "@tensorflow/tfjs";

const baseURL =
  window.location.protocol === "https:" ? window.location.href : ".";

export const whiteModel = {
  format: "layers-model",
  generatedBy: "keras v2.4.0",
  convertedBy: "TensorFlow.js Converter v3.9.0",
  modelTopology: {
    keras_version: "2.4.0",
    backend: "tensorflow",
    model_config: {
      class_name: "Sequential",
      config: {
        name: "sequential",
        layers: [
          {
            class_name: "InputLayer",
            config: {
              batch_input_shape: [null, 64],
              dtype: "float32",
              sparse: false,
              ragged: false,
              name: "dense_input",
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense",
              trainable: true,
              batch_input_shape: [null, 64],
              dtype: "float32",
              units: 64,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "GlorotUniform",
                config: {
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_1",
              trainable: true,
              dtype: "float32",
              units: 64,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "GlorotUniform",
                config: {
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_2",
              trainable: true,
              dtype: "float32",
              units: 64,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "RandomUniform",
                config: {
                  minval: -0.05,
                  maxval: 0.05,
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_3",
              trainable: true,
              dtype: "float32",
              units: 64,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "RandomUniform",
                config: {
                  minval: -0.05,
                  maxval: 0.05,
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_4",
              trainable: true,
              dtype: "float32",
              units: 64,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "RandomUniform",
                config: {
                  minval: -0.05,
                  maxval: 0.05,
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_5",
              trainable: true,
              dtype: "float32",
              units: 64,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "RandomUniform",
                config: {
                  minval: -0.05,
                  maxval: 0.05,
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_6",
              trainable: true,
              dtype: "float32",
              units: 64,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "RandomUniform",
                config: {
                  minval: -0.05,
                  maxval: 0.05,
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_7",
              trainable: true,
              dtype: "float32",
              units: 32,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "RandomUniform",
                config: {
                  minval: -0.05,
                  maxval: 0.05,
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_8",
              trainable: true,
              dtype: "float32",
              units: 16,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "RandomUniform",
                config: {
                  minval: -0.05,
                  maxval: 0.05,
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
          {
            class_name: "Dense",
            config: {
              name: "dense_9",
              trainable: true,
              dtype: "float32",
              units: 4,
              activation: "relu",
              use_bias: true,
              kernel_initializer: {
                class_name: "RandomUniform",
                config: {
                  minval: -0.05,
                  maxval: 0.05,
                  seed: null,
                },
              },
              bias_initializer: {
                class_name: "Zeros",
                config: {},
              },
              kernel_regularizer: null,
              bias_regularizer: null,
              activity_regularizer: null,
              kernel_constraint: null,
              bias_constraint: null,
            },
          },
        ],
      },
    },
    training_config: {
      loss: "mean_squared_error",
      metrics: [
        [
          {
            class_name: "MeanMetricWrapper",
            config: {
              name: "acc",
              dtype: "float32",
              fn: "categorical_accuracy",
            },
          },
        ],
      ],
      weighted_metrics: null,
      loss_weights: null,
      optimizer_config: {
        class_name: "Adam",
        config: {
          name: "Adam",
          learning_rate: 0.0010000000474974513,
          decay: 0.0,
          beta_1: 0.8999999761581421,
          beta_2: 0.9990000128746033,
          epsilon: 1e-7,
          amsgrad: false,
        },
      },
    },
  },
  weightsManifest: [
    {
      paths: [`${baseURL}/whiteModel.bin`],
      weights: [
        {
          name: "dense/kernel",
          shape: [64, 64],
          dtype: "float32",
        },
        {
          name: "dense/bias",
          shape: [64],
          dtype: "float32",
        },
        {
          name: "dense_1/kernel",
          shape: [64, 64],
          dtype: "float32",
        },
        {
          name: "dense_1/bias",
          shape: [64],
          dtype: "float32",
        },
        {
          name: "dense_2/kernel",
          shape: [64, 64],
          dtype: "float32",
        },
        {
          name: "dense_2/bias",
          shape: [64],
          dtype: "float32",
        },
        {
          name: "dense_3/kernel",
          shape: [64, 64],
          dtype: "float32",
        },
        {
          name: "dense_3/bias",
          shape: [64],
          dtype: "float32",
        },
        {
          name: "dense_4/kernel",
          shape: [64, 64],
          dtype: "float32",
        },
        {
          name: "dense_4/bias",
          shape: [64],
          dtype: "float32",
        },
        {
          name: "dense_5/kernel",
          shape: [64, 64],
          dtype: "float32",
        },
        {
          name: "dense_5/bias",
          shape: [64],
          dtype: "float32",
        },
        {
          name: "dense_6/kernel",
          shape: [64, 64],
          dtype: "float32",
        },
        {
          name: "dense_6/bias",
          shape: [64],
          dtype: "float32",
        },
        {
          name: "dense_7/kernel",
          shape: [64, 32],
          dtype: "float32",
        },
        {
          name: "dense_7/bias",
          shape: [32],
          dtype: "float32",
        },
        {
          name: "dense_8/kernel",
          shape: [32, 16],
          dtype: "float32",
        },
        {
          name: "dense_8/bias",
          shape: [16],
          dtype: "float32",
        },
        {
          name: "dense_9/kernel",
          shape: [16, 4],
          dtype: "float32",
        },
        {
          name: "dense_9/bias",
          shape: [4],
          dtype: "float32",
        },
      ],
    },
  ],
} as ModelAndWeightsConfig;
