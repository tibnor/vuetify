// Components
// import { VExpandTransition } from '@/components/transitions'

// Composables
// import { useList } from './list'
import { makeTagProps } from '@/composables/tag'
import { useNestedGroupActivator, useNestedItem } from '@/composables/nested/nested'

// Utilities
import type { Ref } from 'vue'
import { computed, defineComponent } from 'vue'
import { genericComponent } from '@/util'

// Types
import type { MakeSlots } from '@/util'
import type { InternalTreeviewItem } from './VTreeview'

export type TreeviewGroupActivatorSlot = {
  props: {
    collapseIcon: string
    expandIcon: string
    class: string
    hideExpand: boolean | undefined
  }
}

const VTreeviewGroupActivator = defineComponent({
  name: 'VTreeviewGroupActivator',

  setup (_, { slots }) {
    useNestedGroupActivator()

    return () => slots.default?.()
  },
})

export const VTreeviewGroup = genericComponent<new <T extends InternalTreeviewItem>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    activator: [TreeviewGroupActivatorSlot]
    default: []
  }>
}>()({
  name: 'VTreeviewGroup',

  props: {
    collapseIcon: {
      type: String,
      default: '$treeviewCollapse',
    },
    expandIcon: {
      type: String,
      default: '$treeviewExpand',
    },
    value: {
      type: null,
      default: undefined,
    },
    hideExpand: Boolean,

    ...makeTagProps(),
  },

  setup (props, { slots }) {
    const { isOpen, id } = useNestedItem(computed(() => props.value), true)

    const activatorProps: Ref<TreeviewGroupActivatorSlot['props']> = computed(() => ({
      collapseIcon: props.collapseIcon,
      expandIcon: props.expandIcon,
      class: 'v-treeview-group__header',
      value: id.value,
      hideExpand: props.hideExpand,
    }))

    return () => {
      return (
        <props.tag
          class={[
            'v-treeview-group',
          ]}
        >
          <VTreeviewGroupActivator>
            { slots.activator?.({ props: activatorProps.value }) }
          </VTreeviewGroupActivator>
          <div class="v-treeview-group__items" v-show={ isOpen.value }>
            { slots.default?.() }
          </div>
        </props.tag>
      )
    }
  },
})
