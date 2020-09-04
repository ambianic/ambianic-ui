<template>
  <v-row
    align="start"
    justify="space-around"
  >
    <v-col
      style="max-width: 500px;"
      align="center"
      justify="center"
      cols="12"
      class="pa-0 ma-0 fill-height"
    >
      <v-card
        class="mx-auto text-left"
        data-cy="basecard"
      >
        <v-list
          three-line
        >
          <amb-list-item
            id="help-title"
            title="Connect your Edge to the Network"
          />
        </v-list>
        <v-list>
          <v-container fluid>
            <v-switch
              v-model="edgeConnected"
              label="Connected to Ambianic Edge?"
              color="green"
            />
          </v-container>
        </v-list>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              id="searchWifis"
              color="red"
              dark
              v-bind="attrs"
              v-on="on"
              data-cy="wifi-button"
            >
              Enter Wifi
            </v-btn>
          </template>
          <v-card>
            <v-subheader
              data-cy="wifi-card"
            >
              Enter Wifi Details
            </v-subheader>
            <v-text-field
              v-model="selectedWifi.wifi"
              label="WiFi name"
            />
            <v-text-field
              v-model="selectedWifi.password"
              label="Password"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="getWifi();"
              >
                Enter network
                </v-btn>
              </v-card-actions>
          </v-card>
          <!--<v-card>
            <v-list
              shaped
              :flat="flat"
            >
              <v-subheader
                data-cy="wifi-card"
              >
                WIFIS FOUND
              </v-subheader>
              <v-list-item-group
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in wifis"
                  :key="i"
                >
                  <v-list-item-content
                    data-cy="wifis"
                  >
                    <v-list-item-title
                      v-html="item.title"
                      @click="setWifi(item.title)"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="dialog = false; passwordDialog=true"
                data-cy="close-dialog"
              >
                SELECT
              </v-btn>
            </v-card-actions>
            <v-dialog
              v-model="passwordDialog"
              width="500"
            >
              <v-card>
                <v-text-field
                  single-line
                  v-model="selectedWifi.password"
                />
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    text
                    @click="getWifi(); passwordDialog=false"
                  >
                    Enter Password
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>-->
        </v-dialog>
        <!-- This button will be removed before merge to master. Just for debugging purposes.
        Intended to force connect using bluetooth -->
        <v-btn @click="bluetooth">
          Bluetooth
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import AmbListItem from '@/components/shared/ListItem.vue'

export default {
  name: 'Setup',
  components: {
    AmbListItem
  },
  data () {
    return {
      label: 'Enter password',
      passwordDialog: false,
      edgeConnected: false, // Let this variable enter Vuex later on so the state is saved globally.
      dialog: false,
      selectedWifi: {
        wifi: '',
        password: ''
      },
      // This will be an array of objects for all wifis found supplied from Edge.
      // For test purposes, a mock data will be created in separate file
      wifis: [
        {
          title: 'WiFi 1'
        },
        {
          title: 'WiFi 2'
        },
        {
          title: 'WiFi 3'
        },
        {
          title: 'WiFi 4'
        },
        {
          title: 'WiFi 5'
        }
      ],
      shaped: false,
      flat: false
    }
  },
  methods: {
    /**
     * Steps I thought the Bluetooth would work
     *
     * RPI will be named AmbianicEdge, I thought the filters services then should connect to AmbianicEdge
     *
     * Upon connection, RPI will supply an array with Objects of all names of found Wifis
     *
     * User selects one WiFi and is promted to insert a password
     *
     * An object containing two strings will be sent to RPI
     *
     * {
     *   wifi:name,  (String)
     *   password:password  (String)
     * }
     *
     * If successful connection, RPI returns true otherwise false
     *
     * In the setup card, there will be a switch. If RPI returns true, it will switch to
     * green to show the user it has been successfully connected to the Wifi.
     *
     *
     * UPDATE. As first iteration the user will have to enter both wifi and password.
     * A list with selectable networks will be in iteration 2.
     */
    bluetooth () {
      navigator.bluetooth.requestDevice({
        // filters: [
        //   { services: ['12342233-0000-1000-8000-00805f9b34fb'] }
        // ],
        optionalServices: ['12342233-0000-1000-8000-00805f9b34fb'],
        acceptAllDevices: true
      })
        .then(device => {
          console.log('connect')
          return device.gatt.connect()
        })
        .then(server => {
          console.log('get service')
          return server.getPrimaryService(0x12342233)
        })
        .then(service => {
          console.log('get char')
          return service.getCharacteristic(0x12343344)
        })
        // .then(characteristic => characteristic.startNotifications())
        .then(async (characteristic) => {
          // this.selectedWifi is the object that contains the details the user inserted:
          // this.selectedWifi.wifi is the wifi name
          // this.selectedWifi.password is the password
          console.log(this.selectedWifi)
          characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged)

          const val = await characteristic.readValue()
          console.log('READ #1 = ', val)

          const val1 = Uint8Array.of(1)
          await characteristic.writeValue(val1)

          const val2 = await characteristic.readValue()
          console.log('READ #2 = ', val2)
        })
        .catch(error => console.log(error))
    },
    handleCharacteristicValueChanged (event) {
      console.log('handleCharacteristicValueChanged', event)
      console.log('raw %s', event.target.value)
    },
    setWifi (wifi) {
      this.selectedWifi.wifi = wifi
    },
    setPassword (password) {
      this.selectedWifi.password = password
    },
    getWifi () {
      this.dialog = false
      this.bluetooth(this.selectedWifi)
    }
  }
}
</script>
