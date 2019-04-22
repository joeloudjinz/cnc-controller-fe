<template>
  <v-layout v-if="displayRsultes == true" v-show="displayRsultes" justify-center row wrap>
    <v-flex xs12>
      <v-toolbar color="teal" dark card dense>
        <v-toolbar-title>Conversion Results</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-btn icon @click="showResultsPanel = !showResultsPanel">
          <v-icon>{{ showResultsPanel ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
        </v-btn>
      </v-toolbar>
    </v-flex>
    <v-flex xs12>
      <v-fade-transition>
        <v-card v-show="showResultsPanel">
          <v-card-text>
            <v-layout justify-center row wrap>
              <!-- Old configuration -->
              <v-flex xs12 sm12 md3 lg3 px-1>
                <v-card color="teal lighten-1" class="white--text elevation-5 mb-1">
                  <v-card-text class="d-flex">
                    <table>
                      <header class="font-weight-bold py-2">Conversion Prameters</header>
                      <tr>
                        <td class="font-weight-meduim">Tool Diameter</td>
                        <td class="align-center">{{ oldtoolDiameter }} mm</td>
                      </tr>
                      <tr>
                        <td class="font-weight-meduim">Sensitivity</td>
                        <td class="align-center">{{ oldsensitivity }} mm</td>
                      </tr>
                      <tr>
                        <td class="font-weight-meduim">Scale Axes</td>
                        <td class="align-center">{{ oldscaleAxes }} mm</td>
                      </tr>
                      <tr>
                        <td class="font-weight-meduim">Deep Step</td>
                        <td class="align-center">{{ olddeepStep }} mm</td>
                      </tr>
                      <tr>
                        <td class="font-weight-meduim">Black Z</td>
                        <td class="align-center">{{ oldblackZ }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-meduim">White Z</td>
                        <td class="align-center">{{ oldwhiteZ }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-meduim">Safe Z</td>
                        <td class="align-center">{{ oldsafeZ }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-meduim">Safe Z</td>
                        <td class="align-center">{{ oldsafeZ }}</td>
                      </tr>
                    </table>
                  </v-card-text>
                </v-card>
              </v-flex>
              <!-- Image size & times & file information -->
              <v-flex xs12 sm12 md5 lg5 px-1>
                <v-card color="teal lighten-1" class="white--text elevation-5 mb-1">
                  <v-card-text class="d-flex">
                    <table>
                      <tr>
                        <td class="font-weight-bold">Image Size:</td>
                        <td class="align-end">{{ imegSize }}</td>
                      </tr>
                    </table>
                  </v-card-text>
                </v-card>
                <v-card color="teal lighten-1" class="white--text elevation-5 mb-1">
                  <v-card-text class="d-flex">
                    <table>
                      <tr>
                        <td class="font-weight-bold">Started at</td>
                        <td class="align-center">{{ startTime }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">Ended at</td>
                        <td class="align-center">{{ endTime }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">Elapsed Time</td>
                        <td class="align-center">{{ elapsedTime }} seconds</td>
                      </tr>
                    </table>
                  </v-card-text>
                </v-card>
                <v-card color="teal lighten-1" class="white--text elevation-5 my-1">
                  <v-card-text class="d-flex pb-4">
                    <table>
                      <tr>
                        <td class="font-weight-bold">File Name</td>
                        <td class="align-end">{{ fileName }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">Size</td>
                        <td class="align-end">{{ size }} Mb</td>
                      </tr>
                    </table>
                  </v-card-text>
                </v-card>
              </v-flex>
              <!-- Proccessed black pixels progress circle -->
              <v-flex xs12 sm12 md4 lg4 px-1>
                <v-card color="teal lighten-1" class="white--text elevation-5">
                  <v-card-text class="d-flex">
                    <v-tooltip bottom>
                      <template #activator="data">
                        <v-progress-circular
                          :rotate="360"
                          :size="220"
                          :width="10"
                          :value="value"
                          color="white"
                          v-on="data.on"
                        >{{ value }}</v-progress-circular>
                      </template>
                      <span>The percentage of the proccessed black pixels in the picture</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template #activator="data">
                        <v-progress-circular
                          :rotate="360"
                          :size="150"
                          :width="10"
                          :value="errorValue"
                          color="red lighten-1"
                          v-on="data.on"
                        >{{ errorValue }}</v-progress-circular>
                      </template>
                      <span>The percentage of the unproccessed black pixels in the picture</span>
                    </v-tooltip>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template #activator="data">
                <v-btn
                  class="teal--text"
                  flat
                  v-on="data.on"
                  @click="initializeDrawOperation()"
                  :disabled="isTransmissionProcessActive"
                >
                  <v-icon left dark>fas fa-draw-polygon</v-icon>Draw
                </v-btn>
              </template>
              <span>Send generated gcode to machine</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-fade-transition>
    </v-flex>
  </v-layout>
</template>
