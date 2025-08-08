import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PseudocodePanel from '@/components/panels/PseudocodePanel.vue';

function makeLines(n: number) {
  return Array.from({ length: n }, (_, i) => `line ${i + 1}`);
}

describe('PseudocodePanel', () => {
  it('marks current line with aria-current and keeps it in view', async () => {
    const wrapper = mount(PseudocodePanel, {
      props: {
        lines: makeLines(50),
        highlight: [1],
        showCode: false,
        code: '',
      },
      attachTo: document.body,
    });

    // 초기 aria-current 검사
    const first = wrapper.find('[aria-current="true"]');
    expect(first.exists()).toBe(true);

    // 강조 라인을 하단 영역으로 이동시켜 자동 스크롤 유도
    await wrapper.setProps({ highlight: [40] });
    await wrapper.vm.$nextTick();

    const current = wrapper.find('[aria-current="true"]');
    expect(current.exists()).toBe(true);
  });
});
