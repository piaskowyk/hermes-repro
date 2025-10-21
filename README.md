## Hermes reproduction repository

Repository contains two react native apps created by command `npx @react-native-community/cli init <name>`. The implementation of both apps are identical, the only difference is in the configuration.

- `hermesv0` - uses stable Hermes
- `hermesv1` - uses Hermes v1

## Performance comparison in Debug mode

### Hermes v0

- Startup time: 370ms
- nBody benchmark: 2550ms

### Hermes v1

- Startup time: 10900ms
- nBody benchmark: 1830ms

The problem appears when I include a file `longFile.ts` that contains a large amount of mathematical operations (a long sum function). Parsing this 3,000-line file takes around 10 seconds. At the same time, when I add a file that contains non-mathematical operations but is much longer—more than 100,000 lines—it doesn't significantly affect startup time.

According to the profiler, most of the time (around 10 seconds) is spent in the `hermes::DominanceInfo::properlyDominates(hermes::Instruction const*, hermes::Instruction const*)` method.

<img width="2105" height="896" alt="profiler" src="https://github.com/user-attachments/assets/944b8dab-1b24-4408-9bc4-f14109f42cdf" />


Apart from the startup, the later code execution performance of Hermes V1 seems to be better—the nBody benchmark is around 30% faster.

## Memory usage comparison in Release mode

It seems like in Hermes v1 some data structures takes significantly more memory - on average 30-40% more. Especially `Map`, `Set`, `Object`, `Function` and strings.

To test it I've used the following code to generate large arrays of different data structures:

```typescript
function generateLargeArray() {
  const largeArray = [];
  for (let i = 0; i < 5_000_000; i++) {
    largeArray.push(new Map());
    largeArray.push(new Set());
    largeArray.push(() => {});
    largeArray.push({});
    largeArray.push(`${i} this is very very very long string`);
  }
  return largeArray;
}
```

### Map()
- Hermes v0: 720MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 181,
  js_gcCPUTime: 0.6960000000000005,
  js_gcTime: 0.6970000000000005,
  js_totalAllocatedBytes: 702794192,
  js_allocatedBytes: 702063464,
  js_heapSize: 725614592,
  js_mallocSizeEstimate: 0,
  js_vaSize: 725614592,
  js_externalBytes: 1905,
  js_markStackOverflows: 0 
}
```

- Hermes v1: 1210MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 282,
  js_gcCPUTime: 1.3132270000000001,
  js_gcTime: 1.312433665,
  js_totalAllocatedBytes: 1252549304,
  js_allocatedBytes: 1222477904,
  js_heapSize: 1145044992,
  js_mallocSizeEstimate: 0,
  js_vaSize: 1145044992,
  js_externalBytes: 263,
  js_markStackOverflows: 0 
}
```

### Set()
- Hermes v0: 720MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 181,
  js_gcCPUTime: 0.6970000000000005,
  js_gcTime: 0.7000000000000005,
  js_totalAllocatedBytes: 702794192,
  js_allocatedBytes: 702063464,
  js_heapSize: 725614592,
  js_mallocSizeEstimate: 0,
  js_vaSize: 725614592,
  js_externalBytes: 1905,
  js_markStackOverflows: 0
}
```
- Hermes v1: 1210MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 282,
  js_gcCPUTime: 0.9852600000000002,
  js_gcTime: 0.9855231260000001,
  js_totalAllocatedBytes: 1252549304,
  js_allocatedBytes: 1222477904,
  js_heapSize: 1145044992,
  js_mallocSizeEstimate: 0,
  js_vaSize: 1145044992,
  js_externalBytes: 263,
  js_markStackOverflows: 0 
}
```

### Object()
- Hermes v0: 221MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 63,
  js_gcCPUTime: 0.18800000000000014,
  js_gcTime: 0.18700000000000014,
  js_totalAllocatedBytes: 222794192,
  js_allocatedBytes: 221484768,
  js_heapSize: 230686720,
  js_mallocSizeEstimate: 0,
  js_vaSize: 230686720,
  js_externalBytes: 1363,
  js_markStackOverflows: 0 
}
```
- Hermes v1: 503MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 106,
  js_gcCPUTime: 0.35400899999999996,
  js_gcTime: 0.3537385049999998,
  js_totalAllocatedBytes: 532549304,
  js_allocatedBytes: 503023176,
  js_heapSize: 411041792,
  js_mallocSizeEstimate: 0,
  js_vaSize: 411041792,
  js_externalBytes: 263,
  js_markStackOverflows: 0
}
```

### Function()
- Hermes v0: 221MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 63,
  js_gcCPUTime: 0.1650000000000001,
  js_gcTime: 0.1650000000000001,
  js_totalAllocatedBytes: 222794208,
  js_allocatedBytes: 221484784,
  js_heapSize: 230686720,
  js_mallocSizeEstimate: 0,
  js_vaSize: 230686720,
  js_externalBytes: 1363,
  js_markStackOverflows: 0 
}
```
- Hermes v1: 503MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 107,
  js_gcCPUTime: 0.22839600000000002,
  js_gcTime: 0.23277100200000012,
  js_totalAllocatedBytes: 532549304,
  js_allocatedBytes: 503023176,
  js_heapSize: 411041792,
  js_mallocSizeEstimate: 0,
  js_vaSize: 411041792,
  js_externalBytes: 263,
  js_markStackOverflows: 0 
}
```

### String
- Hermes v0: 501MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 172,
  js_gcCPUTime: 0.1560000000000001,
  js_gcTime: 0.1560000000000001,
  js_totalAllocatedBytes: 661994144,
  js_allocatedBytes: 501358816,
  js_heapSize: 520093696,
  js_mallocSizeEstimate: 0,
  js_vaSize: 520093696,
  js_externalBytes: 1905,
  js_markStackOverflows: 0 
}
```
- Hermes v1: 589MB
```
{ 
  js_VMExperiments: 0,
  js_numGCs: 207,
  js_gcCPUTime: 0.25105599999999995,
  js_gcTime: 0.250358373,
  js_totalAllocatedBytes: 931749264,
  js_allocatedBytes: 589317992,
  js_heapSize: 536870912,
  js_mallocSizeEstimate: 0,
  js_vaSize: 536870912,
  js_externalBytes: 263,
  js_markStackOverflows: 0 
}
```
