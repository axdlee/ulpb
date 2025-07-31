import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/base/Button/index.vue'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(Button, {
      props: {
        text: 'Test Button'
      }
    })
    
    expect(wrapper.text()).toContain('Test Button')
    expect(wrapper.classes()).toContain('btn')
    expect(wrapper.classes()).toContain('btn--solid')
    expect(wrapper.classes()).toContain('btn--medium')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      props: {
        text: 'Click Me'
      }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: {
        text: 'Disabled Button',
        disabled: true
      }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('shows loading state correctly', () => {
    const wrapper = mount(Button, {
      props: {
        text: 'Loading Button',
        loading: true
      }
    })
    
    expect(wrapper.classes()).toContain('btn--loading')
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })
})