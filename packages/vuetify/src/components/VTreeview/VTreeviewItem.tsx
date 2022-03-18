import './VTreeviewItem.sass'

// Components
import { VBtn, VIcon, VProgressCircular, VSelectionControl } from '@/components'

// Composables
import { useNestedItem } from '@/composables/nested/nested'
import { makeTagProps } from '@/composables/tag'
import { makeCheckboxProps, useCheckbox } from '../VCheckbox/VCheckbox'
import { makeRouterProps } from '@/composables/router'

// Utilities
import { computed, watch } from 'vue'
import { defineComponent } from '@/util'

export const VTreeviewItem = defineComponent({
  name: 'VTreeviewItem',

  props: {
    // link: Boolean,
    title: String,
    selected: Boolean,
    loading: Boolean,
    selectOnClick: Boolean,
    hideExpand: Boolean,
    hideSelect: Boolean,
    hover: {
      type: Boolean,
      default: true,
    },
    collapseIcon: {
      type: String,
      default: '$treeviewCollapse',
    },
    expandIcon: {
      type: String,
      default: '$treeviewExpand',
    },
    prependIcon: String,
    appendIcon: String,
    ...makeTagProps(),
    ...makeCheckboxProps(),
    ...makeRouterProps(),
  },

  emits: {
    'update:selected': (value: boolean, e: MouseEvent) => true,
    'update:indeterminate': (value: boolean) => true,
    'click:prepend': (e: MouseEvent) => true,
  },

  setup (props, { slots, emit, attrs }) {
    const id = computed(() => props.value)
    const { select, isSelected, isIndeterminate, isOpen, open, isLeaf } = useNestedItem(id, false)

    const slotProps = computed(() => ({
      select,
      isSelected: isSelected.value,
    }))

    const { trueIcon, falseIcon, indeterminate } = useCheckbox(props)

    watch(isIndeterminate, () => {
      indeterminate.value = isIndeterminate.value
    })

    return () => {
      const hasPrepend = props.prependIcon || slots.prepend
      const hasAppend = props.appendIcon || slots.append
      const hasTitle = props.title || slots.title

      return (
        <div
          class={[
            'v-treeview-item',
            {
              'v-treeview-item--prepend': isLeaf.value,
              'v-treeview-item--select-on-click': props.selectOnClick,
              'v-treeview-item--disabled': props.disabled,
              'v-treeview-item--hover': props.hover,
            },
          ]}
          onClick={ props.selectOnClick ? e => select(!isSelected.value, e) : undefined }
        >
          { (!isLeaf.value && !props.hideExpand) && (
            <div class="v-treeview-item__expand">
              { slots.expand ? slots.expand() : (
                <VBtn
                  variant="text"
                  size="small"
                  disabled={ props.loading }
                  icon={ isOpen.value ? props.collapseIcon : props.expandIcon }
                  onClick={ (e: MouseEvent) => {
                    props.selectOnClick && e.stopPropagation()

                    open(!isOpen.value, e)
                  } }
                />
              ) }
              { props.loading && (
                <VProgressCircular size={ 40 } indeterminate class="v-treeview-item__loading" />
              ) }
            </div>
          ) }

          <div class="v-treeview-item__content">
            { !props.hideSelect && (slots.selection ? slots.selection(slotProps.value) : (
              <VSelectionControl
                type="checkbox"
                disabled={ props.disabled || props.loading }
                trueIcon={ trueIcon.value }
                falseIcon={ falseIcon.value }
                modelValue={ isSelected.value }
                onClick={ (e: MouseEvent) => {
                  props.selectOnClick && e.stopPropagation()

                  select(!isSelected.value, e)
                } }
                aria-checked={ indeterminate.value ? 'mixed' : undefined }
              />
            )) }

            { hasPrepend && (
              <div class="v-treeview-item__prepend">
                { slots.prepend ? slots.prepend() : props.prependIcon ? (
                  <VIcon icon={ props.prependIcon } />
                ) : undefined }
              </div>
            ) }

            { hasTitle && (
              <div class="v-treeview-item__label">
                { slots.title ? slots.title() : props.title }
              </div>
            ) }

            { hasAppend && (
              <div class="v-treeview-item__append">
                { slots.append ? slots.append() : (
                  <VIcon icon={ props.appendIcon } />
                ) }
              </div>
            ) }
          </div>
        </div>
      )
    }
  },
})
