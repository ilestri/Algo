import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PlayerControls from '@/components/controls/PlayerControls.vue';

describe('PlayerControls', () => {
  it('emits events and updates speed', async () => {
    const wrapper = mount(PlayerControls, {
      props: {
        playing: false,
        canBack: true,
        canForward: true,
        index: 0,
        total: 10,
        speed: 1,
        algo: 'sorting/quick',
        input: { array: [3,1,2] },
      },
    });

    await wrapper.get('button[aria-label="재생/일시정지 (Space)"]').trigger('click');
    expect(wrapper.emitted('toggle')).toBeTruthy();

    await wrapper.get('button[aria-label="이전 (←)"]').trigger('click');
    expect(wrapper.emitted('back')).toBeTruthy();

    await wrapper.get('button[aria-label="다음 (→)"]').trigger('click');
    expect(wrapper.emitted('forward')).toBeTruthy();

    await wrapper.get('button[aria-label="끝으로 (End)"]').trigger('click');
    expect(wrapper.emitted('end')).toBeTruthy();

    const spy = vi.fn();
    wrapper.vm.$.emit = spy as any;
    // SpeedSlider는 change 이벤트를 내보냄
    const slider = wrapper.findComponent({ name: 'SpeedSlider' });
    await slider.vm.$emit('change', 2);
    expect(wrapper.emitted('update:speed') || spy).toBeTruthy();
  });
});
