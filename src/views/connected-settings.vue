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
      <div v-if="peerConnectionStatus !== 'PEER_CONNECTED'" >
        <h1 class="top-title">
        Ambianic Edge Device connected!
        </h1>
        <div style="display: flex; justify-content: center" >
          <button class="button" >
            Add New Edge Device
          </button>
        </div>
      </div>
      <h1 v-else class="title">
       Connecting To Ambianic Edge Device ...
      </h1>
    </div>

    <div style="background-color: #f9fafa; height: calc(100vh - 390px); " >

    <div class="align-center" >
    <v-card width="800" class="card-box" >
      <div class="contents">
        <div style="height: 55px; display : flex; justify-content: center" >
            <div style="display: flex; justify-content: center; align-items: center" >
              <h3 style="font-weight: normal; margin: 0 .3rem"  > Edge Device Configuration </h3>
            </div>
        </div>

        <hr />
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
          <amb-list-item
              title="Alerts"
              subtitle="Events Alert Settings"
              icon-name="bell"
          />
        </v-list>
      </div>
    </v-card>
    </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AmbListItem from '@/components/shared/ListItem.vue'

export default {
  name: 'ConnectedSettings',
  data () {
    return {
      test: false
    }
  },
  components: {
    AmbListItem
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

.id {
  font-weight: normal;
  font-size: 1rem;
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

.hedge {
  padding: .5rem 1rem;
  height: 50px;
  color: #fff;
  display: flex;
  align-items: center;
  background-color: #3566b1;
}

.title {
  font-size: 2.7rem;
  text-align: center;
  font-weight: normal;
}

.footer {
  display: flex;
  justify-content: center;
}
</style>
