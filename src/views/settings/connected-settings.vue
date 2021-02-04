<template>
  <div class="body">
    <v-progress-linear
      color="info"
      indeterminate
      v-if="peerConnectionStatus !== 'PEER_CONNECTED'"
      :size="50"
      :width="7"
    />
       <div class="top-section">
      <div v-if="peerConnectionStatus === 'PEER_CONNECTED'">
        <h1 class="top-title">
          Ambianic Edge Device connected!
        </h1>
        <div style="display: flex; justify-content: center">
          <button class="button">
            <v-icon style="color: white; margin: 0 .2rem">
              mdi-plus
            </v-icon>
            Add New Edge Device
          </button>
        </div>
      </div>
      <h1
        v-else
        class="top-title"
      >
        Connecting To Ambianic Edge Device ...
      </h1>
    </div>

    <div class="card-section">
      <div class="align-center">
        <v-card
          width="800"
          class="card-box"
        >
          <div class="contents">
            <div style="height: 55px; display : flex; justify-content: center">
              <div style="display: flex; justify-content: center; align-items: center">
                <h4 style="font-weight: normal;">
                  Edge Device Configuration
                </h4>
              </div>
            </div>

            <hr>
            <v-expansion-panels accordion>
              <v-expansion-panel>
                <v-list
                  two-line
                >
                  <amb-list-item
                    title="My Ambianic Edge Device"
                    subtitle="Display Name"
                    icon-name="tag"
                  />
                  <v-divider inset />
                  <amb-list-item
                    :sensitive-field="true"
                    :title="edgePeerId"
                    subtitle="Peer ID"
                    icon-name="identifier"
                    id="edgePeerID"
                  />
                  <v-divider inset />
                  <amb-list-item
                    :title="version"
                    subtitle="Release Version"
                    icon-name="alpha-v-circle-outline"
                  />
                  <v-divider inset />
                  <v-expansion-panel-header>
                    <amb-list-item
                      title="Alerts"
                      subtitle="Events Alert Settings"
                      icon-name="bell"
                    />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <Alert />
                  </v-expansion-panel-content>
                </v-list>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AmbListItem from '@/components/shared/ListItem.vue'
import Alert from '@/views/settings/alerts.vue'

export default {
  name: 'ConnectedSettings',
  data () {
    return {
      test: false
    }
  },
  components: {
    AmbListItem,
    Alert
  },
  computed: {
    ...mapState({
      edgePeerId: (state) => state.pnp.remotePeerId,
      peerConnectionStatus: (state) => state.pnp.peerConnectionStatus,
      version: (state) => state.version
    })
  }
}
</script>

<style lang="css" scoped>
.top-section {
  /*padding: 0 1rem 1rem;*/
  background-color: #b2dfdb;
  height: 300px;
  color: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-section {
  background-color: #f9fafa;
  height: calc(100vh - 390px);
}

.card-box {
  box-shadow: 2px 4px grey;
  transform: translateY(-15%);
}

.align-center {
  display: flex;
  justify-content: center;
}

.button {
  display: flex;
  height: 40px;
  width: auto;
  font-size: .85rem;
  padding: .5rem 2rem;
  margin: .6rem 0;
  background-color: #3566b1;
  border: 1px solid #3566b1;
  border-radius: 5px;
  color: #fff;
}

.top-title {
  font-weight: 500;
}

@media (max-width: 800px) {
  .top-title {
    text-align: center;
    font-size: 1.7rem;
    font-weight: normal;
  }
}

@media (max-width: 400px) {
  .top-title {
    text-align: center;
    padding: 0 1rem;
    font-size: 1.35rem;
  }

  .top-section {
    height: 270px;
  }

  .card-section {
    background-color: #f9fafa;
    height: calc(100vh - 100%);
  }
}
</style>
