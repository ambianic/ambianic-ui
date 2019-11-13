<!-- App.vue -->
<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
            :class="item.class"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
            :class="item.class"
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            :to="item.link"
            :class="item.class"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <span class="hidden-sm-and-down">Ambianic</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      />
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-badge
          top
          color="error lighten-1"
          right
          overlap
          class="align-self-center"
        >
          <v-icon>mdi-heart</v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon>
        <v-badge
          top
          color="error lighten-1"
          right
          overlap
          class="align-self-center"
        >
          <template v-slot:badge>
            2
          </template>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
      <v-btn
        icon
        large
      >
        <v-avatar
          size="32px"
          item
        >
          <v-img
            src="@/assets/logo.svg"
            alt="Vuetify"
          />
        </v-avatar>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container
        id="container"
        class="pa-0 ma-0"
        fluid
      >
        <router-view />
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  props: {
    source: String
  },
  data: () => ({
    dialog: false,
    drawer: null,
    items: [
      { icon: 'history', text: 'Timeline', link: '/timeline' },
      { icon: 'contacts', text: 'People', link: '/people' },
      // class: 'hidden-sm-and-down' ensures that an item is not shown
      // on small screens. For example flows are only visible on screens with
      // enough space for a smooth user experience.
      { icon: 'gavel', text: 'Build Flows', link: '/flows', class: 'hidden-sm-and-down' },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Labels',
        model: true,
        children: [
          { icon: 'add', text: 'Create label' }
        ]
      },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'More',
        model: false,
        children: [
          { text: 'Sources' },
          { text: 'Components' },
          { text: 'Integrations' }
        ]
      },
      { icon: 'settings', text: 'Settings', link: '/settings' },
      { icon: 'chat_bubble', text: 'Send feedback', link: '/feedback' },
      { icon: 'help', text: 'Help', link: '/help' },
      { icon: 'info', text: 'About Ambianic', link: '/about' }
    ]
  })
}
</script>
