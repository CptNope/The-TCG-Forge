# 🎨 Custom Prompt Templates - COMPLETE!

**Date:** November 24, 2025

---

## 🚀 NEW: Customizable AI Prompts!

Control exactly how AI generates content with **custom prompt templates**!

---

## ✨ What's Been Added

### **Prompt Template System**
- **15+ default templates** for different styles
- **Create custom templates** with your own prompts
- **Variable system** - Insert card data dynamically
- **Save/load templates** - Reuse your best prompts
- **Preview system** - See prompts before generating

### **Template Types:**
1. **Artwork** - DALL-E image prompts
2. **Ability** - GPT ability text prompts
3. **Flavor** - GPT flavor text prompts
4. **Names** - GPT name generation prompts

---

## 📋 Default Templates Included

### **Artwork Templates:**
- Fantasy Trading Card (Default)
- Realistic Photo Style
- Anime/Manga Style
- Dark Fantasy
- Cute & Colorful

### **Ability Templates:**
- Balanced Ability (Default)
- Aggressive/Offensive
- Defensive/Control
- Complex/Advanced
- Simple/Beginner

### **Flavor Templates:**
- Atmospheric Quote (Default)
- Lore/Worldbuilding
- Character Quote
- Poetic/Mystical

### **Name Templates:**
- Fantasy Name (Default)
- Epic/Legendary
- Cute/Friendly

---

## 🎯 Variable System

### **Available Variables:**
```
{name} - Card name
{type} - Card type (Creature, Spell, etc.)
{type_article} - "a" or "an" (auto-computed)
{element} - Element type
{element_theme} - "Fire element themed" (auto-computed)
{element_context} - "Element: Fire" (auto-computed)
{rarity} - Rarity level
{rarity_theme} - Special text for Epic/Legendary
{power} - Power stat
{health} - Health stat
{cost} - Cost stat
{abilityText} - Ability text
{ability_context} - "Ability: ..." (auto-computed)
{theme} - Custom theme input
```

---

## 🎮 How to Use

### **Use Default Template:**
```typescript
import { getTemplatesByType, processPromptTemplate } from './promptTemplates';

// Get artwork templates
const artTemplates = getTemplatesByType('artwork');
const template = artTemplates[0]; // Fantasy Trading Card

// Process with card data
const prompt = processPromptTemplate(template.userPrompt, {
  name: "Flame Dragon",
  type: "Creature",
  element: "Fire",
  rarity: "Legendary",
  power: 8,
  cost: 6
});

// Result: "Fantasy trading card game artwork for "Flame Dragon", 
// a Creature. Fire element themed. Epic and powerful..."
```

### **Create Custom Template:**
```typescript
const customTemplate = {
  name: "Cyberpunk Style",
  type: "artwork",
  category: "Custom",
  systemPrompt: "",
  userPrompt: "Cyberpunk neon art of {name}, futuristic {type}, {element_theme}glowing neon, dark cityscape background, blade runner style",
  variables: ['name', 'type', 'element', 'element_theme']
};
```

---

## 💡 Benefits

✅ **Consistency** - Same style across all cards
✅ **Control** - Exact prompts you want
✅ **Reusability** - Save and reuse templates
✅ **Flexibility** - Different styles for different sets
✅ **Quality** - Fine-tune for best results

---

## 🎨 Example Workflows

### **Create Anime Set:**
```bash
1. Select "Anime/Manga Style" template
2. Generate 50 card artworks
3. All have consistent anime style!
```

### **Generate Beginner Cards:**
```bash
1. Select "Simple/Beginner" ability template
2. Generate abilities for 20 cards
3. All have easy-to-understand text!
```

### **Dark Fantasy Theme:**
```bash
1. Use "Dark Fantasy" artwork template
2. Use "Poetic/Mystical" flavor template
3. Consistent dark, gothic theme!
```

---

## ✅ Files Created

- `src/services/promptTemplates.ts` - Template system
- 15+ default templates included
- Variable processing system
- Save/load functionality

---

## 🚀 Integration

Templates integrated into OpenAI service:
- Use in Card Editor
- Use in Bulk Editor
- Select template before generating
- Preview prompts

---

**Your AI generations are now fully customizable!** 🎨✨

Create consistent, professional content with custom prompt templates!
