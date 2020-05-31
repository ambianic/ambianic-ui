import { shallowMount } from '@vue/test-utils'
import NavBar from '../../src/components/NavBar.vue'


describe('NavBar', () => {
    it('should render a Topic component when Vue creates it', () => {
        const wrapper = shallowMount(NavBar, {
            computed: {
                currentNavIndex () {
                    return 1
                }
            }
        })

        console.log(wrapper)
      })
})