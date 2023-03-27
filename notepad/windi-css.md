# Windi CSS

### 价值自动推断

如： `p-5px 或者 p-[5px]`=>`padding: 5px` 有很多相信的请查看文档

### 基本配置

- 修改原子 css 基本样式或者添加样式
- 别名
- 快捷方式
- 归因模式
- 等等

如 `colors: {teal: {100: '#ccc'}}` 这里，在 vue 中可以直接 `class="text-teal-100"` 使用

```windi.config.js
import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

export default defineConfig({
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        teal: {
          100: '#ccc',
        },
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)',
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)',
        },
      }
      addUtilities(newUtilities)
    }),
    plugin(({ addComponents }) => {
      const buttons = {
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
        },
        '.btn-blue': {
          'backgroundColor': '#3490dc',
          'color': '#fff',
          '&:hover': {
            backgroundColor: '#2779bd',
          },
        },
        '.btn-red': {
          'backgroundColor': '#e3342f',
          'color': '#fff',
          '&:hover': {
            backgroundColor: '#cc1f1a',
          },
        },
      }
      addComponents(buttons)
    }),
    plugin(({ addDynamic, variants }) => {
      addDynamic('skew', ({ Utility, Style }) => {
        return Utility.handler
          .handleStatic(Style('skew'))
          .handleNumber(0, 360, 'int', number => `skewY(-${number}deg)`)
          .createProperty('transform')
      }, variants('skew'))
    }),
    require('windicss/plugin/filters'),
    require('windicss/plugin/forms'),
    require('windicss/plugin/aspect-ratio'),
    require('windicss/plugin/line-clamp'),
    require('windicss/plugin/typography')({
      modifiers: ['DEFAULT', 'sm', 'lg', 'red'],
    }),
  ],
})
```

### 变体组

`hover:(bg-gray-400 font-medium)`
等于
`.hover:bg-gray-400:hover   .hover:font-medium:hover`

### 快捷方式

在 windi.config.js 进行配置，可以对基本 css 样式进行组合，类似于 class。在 vue 组件中可以直接使用 如下面的`btn`等于 `.btn{ py-2 px-4 font-semibold rounded-lg shadow-md } `这些原子 css 的组合,方便后续页面中的使用

```windi.config.js
export default {
  theme: {
    /* ... */
  },
  shortcuts: {
    'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
    'btn-green': 'text-white bg-green-500 hover:bg-green-700',
  },
}
```

### 暗模式

通过 `.dark` 可以进行暗模式的样式设置

```html
<div class="dark">
  <button class="text-red-400 dark:text-green-400">按钮</button>
</div>
```

```css
/* text-red-400 dark:text-green-400 */
.text-red-400 {
  --tw-text-opacity: 1;
  color: rgba(248, 113, 113, var(--tw-text-opacity));
}
.dark .dark\:text-green-400 {
  --tw-text-opacity: 1;
  color: rgba(52, 211, 153, var(--tw-text-opacity));
}
```

您可以使用以下代码片段使配色方案与用户的系统首选项匹配，或编写自己的逻辑来管理它。

```js
if (window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.add("dark");
else document.documentElement.classList.add("light");
```

### 重要前缀

可以在任何实用程序类前面加上前缀，以将其设置为 。当您想要覆盖特定属性的先前样式规则时，这可能非常有用。!!important

`!text-green-300`

### 指令

@apply
用于将任何现有实用程序类内联到样式块中。

当您在 HTML 中找到要提取到新组件的常见实用程序模式时，这很有用。

```css
/* 可以再css中使用原子组件 */
.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 hover:bg-blue-700 text-white;
  padding-top: 1rem;
}
```

@variants
您可以通过将自己的实用程序的定义包装在指令中来生成自己的实用程序的屏幕变体、状态变体、主题变体。@variants

```css
@variants focus,
hover {
  .rotate-0 {
    transform: rotate(0deg);
  }
  .rotate-90 {
    transform: rotate(90deg);
  }
}
@variants dark {
  .bg-color {
    background-color: #1c1c1e;
  }
}
```

```css
/* 生成的 CSS   */
.rotate-0:focus {
  transform: rotate(0deg);
}
.rotate-90:focus {
  transform: rotate(90deg);
}
.rotate-0:hover {
  transform: rotate(0deg);
}
.rotate-90:hover {
  transform: rotate(90deg);
}
.dark .bg-color {
  background-color: #1c1c1e;
}
```

### 归因模式

配置

```windi.config.ts
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  attributify: true,
})
```

```js
<button text="sm white">Button</button>
```

等于

```js
<button class="text-sm text-white">Button</button>
```

### 归因模式前缀

配置

```windi.config.js
export default {
  attributify: {
    prefix: 'w:',
  },
}
```

```js
<button
  w:bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
  w:text="sm white"
  w:font="mono light"
  w:p="y-2 x-4"
  w:border="2 rounded blue-200"
>
  Button
</button>
```

## 总结：

1. Winid CSS 提供了基本的原子 css 类
2. 提供了自动推类 功能，使 css 的样式开发 更加灵活方便
3. 提供便捷方式和别名，可以对原子 css 进行组合， 对 css 复用提供了很大便利。
4. 提供了暗模式的解决方案
5. 归因模式，以 便签 属性的方式书写。
   如：`<div text="sm white"><div> ==> <div class="text-sm text-white"><div> `
   css 更加清晰
6. 提供了指令方法，可以进行原子 css 和普通 css 的组合方式进行书写
