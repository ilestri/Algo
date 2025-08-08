import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PlayerControls from '@/components/controls/PlayerControls.vue';

describe('PlayerControls keyboard interactions', () => {
  it('handles Space/Arrow/Home/End keys', async () => {
    const wrapper = mount(PlayerControls, {
      props: {
        playing: false,
        canBack: true,
        canForward: true,
        index: 0,
        total: 10,
        speed: 1,
        algo: 'sorting/quick',
        input: { array: [3, 1, 2] },
      },
      attachTo: document.body,
    });

    // focus root (tabindex=0)
    await wrapper.trigger('focus');

    // Space -> toggle
    await wrapper.trigger('keydown', { key: ' ' });
    expect(wrapper.emitted('toggle')).toBeTruthy();

    // ArrowRight -> forward
    await wrapper.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('forward')).toBeTruthy();

    // ArrowLeft -> back
    await wrapper.trigger('keydown', { key: 'ArrowLeft' });
    expect(wrapper.emitted('back')).toBeTruthy();

    // Home -> home
    await wrapper.trigger('keydown', { key: 'Home' });
    expect(wrapper.emitted('home')).toBeTruthy();

    // End -> end
    await wrapper.trigger('keydown', { key: 'End' });
    expect(wrapper.emitted('end')).toBeTruthy();
  });
});
