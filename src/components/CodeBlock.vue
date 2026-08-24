<script setup lang="ts">
import { ref } from 'vue';
import { Check, Copy } from 'lucide-vue-next';

const props = defineProps<{
  code: string;
  language?: string;
}>();

const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy', err);
  }
};
</script>

<template>
  <div class="relative rounded-md border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden text-sm">
    <div class="flex items-center justify-between px-3 py-1.5 bg-slate-950/70 border-b border-slate-800 text-xs text-slate-400 font-mono">
      <span>{{ language || 'CODE' }}</span>
      <button 
        @click="copyCode" 
        class="flex items-center gap-1.5 px-2 py-1 hover:text-white rounded border border-slate-700 bg-slate-800/80 transition-colors"
      >
        <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
        <Copy v-else class="w-3.5 h-3.5" />
        <span>{{ copied ? 'Tersalin' : 'Salin' }}</span>
      </button>
    </div>
    <div class="p-3 overflow-x-auto max-h-80 font-mono text-xs leading-relaxed">
      <pre><code>{{ code }}</code></pre>
    </div>
  </div>
</template>
