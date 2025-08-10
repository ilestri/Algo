import { defineStore } from 'pinia'

export const useInputsStore = defineStore('inputs', {
  state: () => ({
    array: [5, 3, 8, 1, 4] as number[],
    key: 7 as number, // searching/binary 타깃 값
    graphText: '0:1,2\n1:2,3\n2:3\n3:\n',
    seq: [8, 3, 10, 1, 6, 14] as number[]
  }),
  actions: {
    loadSample(category: string) {
      const samples: Record<string, () => void> = {
        sorting: () => {
          this.array = [5, 3, 8, 1, 4, 2, 7]
        },
        searching: () => {
          this.array = [1, 3, 4, 5, 7, 8, 10]
          this.key = 7
        },
        graph: () => {
          this.graphText = '0:1,2\n1:2,3\n2:3\n3:\n'
        },
        tree: () => {
          this.seq = [8, 3, 10, 1, 6, 14]
        }
      }

      samples[category]?.()
    }
  }
})
