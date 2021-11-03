import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import ListItem from '@/components/shared/ListItem'
import Vuex from 'vuex'

describe('ListItem Component', () => {
  let wrapper, store
  const localVue = createLocalVue()

  Vue.use(Vuetify)
  Vue.use(Vuex)

  const vuetify = new Vuetify()

  beforeEach(() => {
    store = new Vuex.Store({
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('It should render editable text field in read only mode', async () => {
    wrapper = await mount(ListItem, {
      localVue,
      vuetify,
      store,
      propsData: {
        ref: 'list-item-edgeDeviceName',
        title: 'Kitchen Monitor',
        subtitle: 'Display Name',
        iconName: 'tag',
        editOption: true
      }
    })
    const listItemDiv = await wrapper.findComponent(ListItem)
    expect(listItemDiv.exists()).toBeTruthy()
    const titleLabel = await wrapper.findComponent({ ref: 'title-read-only' })
    expect(titleLabel.exists()).toBeTruthy()
    expect(titleLabel.html()).toContain('Kitchen Monitor')
    const subtitleLabel = await wrapper.findComponent({ ref: 'subtitle-label' })
    expect(subtitleLabel.exists()).toBeTruthy()
    expect(subtitleLabel.html()).toContain('Display Name')
  })

  it('It should render editable text field in edit mode', async () => {
    wrapper = mount(ListItem, {
      localVue,
      vuetify,
      store,
      propsData: {
        ref: 'list-item-edgeDeviceName',
        title: 'Kitchen Monitor',
        subtitle: 'Display Name',
        iconName: 'tag',
        editOption: true
      }
    })
    const editButton = wrapper.findComponent({ ref: 'icon-start-edit' })
    expect(editButton.exists()).toBeTruthy()
    await editButton.trigger('click')
    const titleLabel = wrapper.findComponent({ ref: 'title-read-only' })
    expect(titleLabel.exists()).toBeFalsy()
    const editField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(editField.exists()).toBeTruthy()
    const input = editField.find('input[type="text"]')
    expect(input.exists()).toBeTruthy()
    expect(input.element.value).toBe('Kitchen Monitor')
    const subtitleLabel = wrapper.findComponent({ ref: 'subtitle-label' })
    expect(subtitleLabel.exists()).toBeTruthy()
    expect(subtitleLabel.html()).toContain('Display Name')
  })

  it('It should cancel editing of text field', async () => {
    wrapper = await mount(ListItem, {
      localVue,
      vuetify,
      store,
      propsData: {
        ref: 'list-item-edgeDeviceName',
        title: 'Kitchen Monitor',
        subtitle: 'Display Name',
        iconName: 'tag',
        editOption: true
      }
    })
    const editButton = wrapper.findComponent({ ref: 'icon-start-edit' })
    expect(editButton.exists()).toBeTruthy()
    await editButton.trigger('click')
    const cancelButton = wrapper.findComponent({ ref: 'icon-cancel-edit' })
    expect(cancelButton.exists()).toBeTruthy()
    await cancelButton.trigger('click')
    const titleLabel = wrapper.findComponent({ ref: 'title-read-only' })
    expect(titleLabel.exists()).toBeTruthy()
    expect(titleLabel.html()).toContain('Kitchen Monitor')
    const editField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(editField.exists()).toBeFalsy()
    const subtitleLabel = wrapper.findComponent({ ref: 'subtitle-label' })
    expect(subtitleLabel.exists()).toBeTruthy()
    expect(subtitleLabel.html()).toContain('Display Name')
  })

  it('It should save new text field value when onSubmit button click succeeds', async () => {
    // mock onSubmit callback succeeds
    const onDisplayNameChanged = jest.fn().mockReturnValue(true)
    wrapper = await mount(ListItem, {
      localVue,
      vuetify,
      store,
      propsData: {
        ref: 'list-item-edgeDeviceName',
        title: 'Kitchen Monitor',
        subtitle: 'Display Name',
        iconName: 'tag',
        editOption: true,
        onSubmit: onDisplayNameChanged
      }
    })
    const editButton = wrapper.findComponent({ ref: 'icon-start-edit' })
    expect(editButton.exists()).toBeTruthy()
    await editButton.trigger('click')
    const editField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(editField.exists()).toBeTruthy()
    const input = editField.find('input[type="text"]')
    expect(input.exists()).toBeTruthy()
    input.setValue('Watch Stairs')
    const submitButton = wrapper.findComponent({ ref: 'icon-save-edit' })
    expect(submitButton.exists()).toBeTruthy()
    await submitButton.trigger('click')
    const noEditField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(noEditField.exists()).toBeFalsy()
    const titleLabel = wrapper.findComponent({ ref: 'title-read-only' })
    expect(titleLabel.exists()).toBeTruthy()
    expect(titleLabel.html()).toContain('Watch Stairs')
    expect(onDisplayNameChanged).toBeCalledTimes(1)
  })

  it('It should save new text field value when onSubmit via key.Enter succeeds', async () => {
    // mock onSubmit callback succeeds
    const onDisplayNameChanged = jest.fn().mockReturnValue(true)
    wrapper = await mount(ListItem, {
      localVue,
      vuetify,
      store,
      propsData: {
        ref: 'list-item-edgeDeviceName',
        title: 'Kitchen Monitor',
        subtitle: 'Display Name',
        iconName: 'tag',
        editOption: true,
        onSubmit: onDisplayNameChanged
      }
    })
    const editButton = wrapper.findComponent({ ref: 'icon-start-edit' })
    expect(editButton.exists()).toBeTruthy()
    await editButton.trigger('click')
    const editField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(editField.exists()).toBeTruthy()
    const input = editField.find('input[type="text"]')
    expect(input.exists()).toBeTruthy()
    input.setValue('Watch Stairs')
    await input.trigger('keyup.enter')
    const noEditField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(noEditField.exists()).toBeFalsy()
    const titleLabel = wrapper.findComponent({ ref: 'title-read-only' })
    expect(titleLabel.exists()).toBeTruthy()
    expect(titleLabel.html()).toContain('Watch Stairs')
    expect(onDisplayNameChanged).toBeCalledTimes(1)
  })

  it('It should not save new text when onSubmit fails', async () => {
    // mock onSubmit callback fails
    const onDisplayNameChanged = jest.fn().mockReturnValue(false)
    wrapper = await mount(ListItem, {
      localVue,
      vuetify,
      store,
      propsData: {
        ref: 'list-item-edgeDeviceName',
        title: 'Kitchen Monitor',
        subtitle: 'Display Name',
        iconName: 'tag',
        editOption: true,
        onSubmit: onDisplayNameChanged
      }
    })
    const editButton = wrapper.findComponent({ ref: 'icon-start-edit' })
    expect(editButton.exists()).toBeTruthy()
    await editButton.trigger('click')
    const editField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(editField.exists()).toBeTruthy()
    const input = editField.find('input[type="text"]')
    expect(input.exists()).toBeTruthy()
    // rules require at least 5 characters
    // and here we are setting a value of length only 3
    input.setValue('Watch Kitchen')
    await input.trigger('keyup.enter')
    const titleLabel = wrapper.findComponent({ ref: 'title-read-only' })
    expect(titleLabel.exists()).toBeTruthy()
    expect(titleLabel.html()).toContain('Kitchen Monitor')
    const noEditField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(noEditField.exists()).toBeFalsy()
    const subtitleLabel = wrapper.findComponent({ ref: 'subtitle-label' })
    expect(subtitleLabel.exists()).toBeTruthy()
    expect(subtitleLabel.html()).toContain('Display Name')
    expect(onDisplayNameChanged).toBeCalledTimes(1)
  })

  it('It should not save new text when rules fail', async () => {
    // mock onSubmit callback succeeds
    const onDisplayNameChanged = jest.fn().mockReturnValue(true)
    const rules = {
      required: value => !!value || 'Required.',
      counter: value => (value.length >= 5 && value.length <= 20) || 'Min 5 and Max 20 characters'
    }
    wrapper = await mount(ListItem, {
      localVue,
      vuetify,
      store,
      propsData: {
        ref: 'list-item-edgeDeviceName',
        title: 'Kitchen Monitor',
        subtitle: 'Display Name',
        iconName: 'tag',
        editOption: true,
        onSubmit: onDisplayNameChanged,
        rules: [rules.required, rules.counter]
      }
    })
    const editButton = wrapper.findComponent({ ref: 'icon-start-edit' })
    expect(editButton.exists()).toBeTruthy()
    await editButton.trigger('click')
    const editField = wrapper.findComponent({ ref: 'inputTitleEdit' })
    expect(editField.exists()).toBeTruthy()
    const input = editField.find('input[type="text"]')
    expect(input.exists()).toBeTruthy()
    // rules require at least 5 characters
    // and here we are setting a value of length only 3
    input.setValue('One')
    await input.trigger('keyup.enter')
    const titleLabel = wrapper.findComponent({ ref: 'title-read-only' })
    expect(input.element.value).toBe('One')
    expect(titleLabel.exists()).toBeFalsy()
    expect(onDisplayNameChanged).toBeCalledTimes(0)
    // rules require at most 20 characters
    // and here we are setting a value of length 30
    input.setValue('123456789012345678901234567890')
    await input.trigger('keyup.enter')
    const noTitleLabel = wrapper.findComponent({ ref: 'title-read-only' })
    expect(input.element.value).toBe('123456789012345678901234567890')
    expect(noTitleLabel.exists()).toBeFalsy()
    expect(onDisplayNameChanged).toBeCalledTimes(0)
  })
})
