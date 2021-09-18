import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Dialog from '@/components/shared/Dialog.vue'

describe('Dialog', () => {
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify)
  const vuetify = new Vuetify()

  beforeEach(() => {
    wrapper = mount(Dialog, {
      localVue,
      vuetify,
      data: () => ({
        showModal: true
      }),
      props: {
        modalTitle: 'A Dialog Component',
        modalText: 'Dialog text'
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('It displays a dialog component containing a card', () => {
    const dialog = wrapper.get('#dialog-component')

    expect(dialog.exists()).toBeTruthy()
    expect(dialog.find('#dialog-card').exists()).toBeTruthy()
  })

  it('Dialog displays `modalTitle` & `modalText` prop values', async () => {
    await wrapper.setProps({
      modalTitle: 'Dialog Component Title',
      modalText: 'Dialog Component Text'
    })

    const dialog = wrapper.get('#dialog-component')

    expect(dialog.find('#dialog-title').text()).toBe('Dialog Component Title')
    expect(dialog.find('#dialog-text').text()).toBe('Dialog Component Text')
  })
})
