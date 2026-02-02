<template>
  <div class="add-panel">
    <input
      ref="inputRef"
      v-model="symbolInput"
      type="text"
      placeholder="Enter stock symbol"
      class="gwt-TextBox"
      @keypress.enter="handleAddStock"
    />
    <button 
      class="gwt-Button"
      @click="handleAddStock"
    >
      Add
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// State (corresponds to GWT TextBox field)
const symbolInput = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

// Events (corresponds to GWT ClickHandler and KeyPressHandler)
const emit = defineEmits<{
  'add-stock': [symbol: string];
}>();

// Methods
function handleAddStock() {
  if (symbolInput.value.trim()) {
    emit('add-stock', symbolInput.value);
    symbolInput.value = ''; // Clear input after adding
    inputRef.value?.focus(); // Keep focus on input
  }
}

// Auto-focus on mount (corresponds to newSymbolTextBox.setFocus(true) in GWT)
onMounted(() => {
  inputRef.value?.focus();
});

// Expose focus method for parent component
defineExpose({
  focus: () => inputRef.value?.focus(),
  selectAll: () => inputRef.value?.select(),
});
</script>

<style scoped>
.add-panel {
  display: flex;
  gap: 0.5em;
  margin-bottom: 1em;
}

.gwt-TextBox {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 1em;
}

.gwt-TextBox:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 3px rgba(76, 175, 80, 0.5);
}

.gwt-Button {
  padding: 6px 16px;
  border: 1px solid #ccc;
  background-color: #4CAF50;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
}

.gwt-Button:hover {
  background-color: #45a049;
}

.gwt-Button:active {
  background-color: #3d8b40;
}
</style>
