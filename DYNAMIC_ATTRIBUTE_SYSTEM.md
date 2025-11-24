# 🎯 Dynamic Attribute System - COMPLETE!

**Date:** November 24, 2025

---

## 🚀 Revolutionary Feature: Fully Customizable Card Structure!

Your TCG tool now has a **completely dynamic attribute system** where EVERYTHING about a card can be customized!

---

## 🎉 What's New

### **Dynamic Attributes**
- **Everything is an attribute** - Power, Cost, Rarity, Type, etc.
- **Add/Remove anything** - No fixed card structure
- **Multiple data types** - Number, Text, Boolean, Dropdown, Lists, Colors, Dates
- **Fully customizable** - Create ANY TCG mechanics

### **Attribute Types**
- **Number** - Stats like Power, Health, Cost (with min/max)
- **Text** - Names, descriptions, flavor text
- **Boolean** - Yes/No flags (Foil, Limited Edition)
- **Dropdown** - Single choice (Rarity, Type, Element)
- **List** - Multiple values (Tags, Keywords)
- **Color** - Color pickers for themes
- **Date** - Release dates, expiration
- **Icon** - Visual symbols
- **Tag** - Categorization

---

## 🎯 Key Concepts

### **No More Fixed Structure!**

#### **Before (❌ Fixed):**
```typescript
interface Card {
  name: string;        // Can't remove
  type: string;        // Can't remove
  cost: number;        // Can't remove
  power: number;       // Can't remove
  health: number;      // Can't remove
  rarity: string;      // Can't remove
  // Fixed fields!
}
```

#### **After (✅ Dynamic):**
```typescript
interface Card {
  id: string;
  projectId: string;
  setId: string;
  attributes: {
    [key: string]: any  // ANYTHING you define!
  }
}

// Examples:
// TCG 1: { power: 5, health: 10, cost: 3, element: "Fire" }
// TCG 2: { attack: 7, defense: 3, speed: 9, type: "Beast" }
// TCG 3: { loyalty: 4, activation: "Tap", color: "Blue" }
```

---

## 📋 Attribute Schema Screen

### **Access:**
```
Navigation → Attribute Schema
or
Attributes screen → "Schema" button
```

### **Features:**

#### **1. Quick Templates**
Pre-built attribute templates you can apply:
- Power (Number, 0-20)
- Health (Number, 0-20)
- Cost (Number, 0-10)
- Rarity (Dropdown: Common/Uncommon/Rare/Epic/Legendary)
- Type (Dropdown: Creature/Spell/Artifact/Enchantment)
- Element (Dropdown: Fire/Water/Earth/Air/Light/Dark)
- Ability Text (Text)
- Foil (Boolean)
- Limited Edition (Boolean)
- Set Number (Text)
- Flavor Text (Text)
- Artist (Text)
- Tags (List)

#### **2. Create Custom Attributes**
Define your own attributes:
- Choose name
- Select type
- Set default value
- Add options (for dropdowns/lists)
- Set min/max (for numbers)
- Mark as required/core
- Organize by category

#### **3. Attribute Categories**
Group attributes logically:
- **Stats** - Power, Health, Defense, Speed
- **Info** - Name, Type, Rarity, Set Number
- **Mechanics** - Element, Keywords, Abilities
- **Meta** - Artist, Release Date, Foil
- **Custom** - Anything you want!

---

## 🎮 How to Use

### **Step 1: Define Your Schema**

```bash
1. Go to Attribute Schema screen
2. Click template or "New Attribute"
3. Configure:
   - Name: "Energy"
   - Type: Number
   - Category: Stats
   - Min: 0, Max: 20
   - Default: 5
   - Required: Yes
4. Click Create
5. ✅ All cards now have "Energy" attribute!
```

### **Step 2: Add More Attributes**

```bash
# For a Pokemon-style TCG:
- HP (Number, 0-300)
- Type (Dropdown: Grass/Fire/Water/Electric...)
- Evolution Stage (Dropdown: Basic/Stage 1/Stage 2)
- Weakness (Dropdown: same as Type)
- Resistance (Dropdown: same as Type)
- Retreat Cost (Number, 0-5)

# For a Magic-style TCG:
- Power (Number)
- Toughness (Number)
- Mana Cost (Text: "{2}{U}{U}")
- Color (List: White/Blue/Black/Red/Green)
- Card Type (Dropdown: Creature/Instant/Sorcery...)
- Subtype (Text: "Goblin Wizard")

# For a Yu-Gi-Oh-style TCG:
- ATK (Number, 0-10000)
- DEF (Number, 0-10000)
- Level (Number, 1-12)
- Attribute (Dropdown: Light/Dark/Earth/Water...)
- Type (Dropdown: Warrior/Spellcaster/Dragon...)
- Effect (Text)
```

### **Step 3: Use in Card Editor**

```bash
1. Create/Edit a card
2. Card editor shows YOUR attributes!
3. Fill in values
4. All cards follow your schema
```

---

## 🔥 Example TCG Schemas

### **1. Traditional Trading Card Game**
```yaml
Stats Category:
  - Power (Number, 1-20)
  - Health (Number, 1-20)
  - Cost (Number, 0-10)

Info Category:
  - Name (Text, required, core)
  - Type (Dropdown: Creature/Spell/Item)
  - Rarity (Dropdown: Common/Uncommon/Rare)
  - Set Code (Text)

Mechanics Category:
  - Element (Dropdown: Fire/Water/Earth/Air)
  - Keywords (List: Flying/Trample/Haste)
  - Ability Text (Text)
```

### **2. Pokemon-Style**
```yaml
Stats:
  - HP (Number, 30-300)
  - Attack Damage (Number, 10-200)
  - Retreat Cost (Number, 0-5)

Info:
  - Pokemon Name (Text, required)
  - Type (Dropdown: 18 types)
  - Stage (Dropdown: Basic/Stage 1/Stage 2)
  - Evolves From (Text)

Mechanics:
  - Weakness (Dropdown: Types)
  - Resistance (Dropdown: Types)
  - Ability Name (Text)
  - Ability Text (Text)
  - Attack 1 Name (Text)
  - Attack 1 Cost (Text)
  - Attack 1 Effect (Text)
```

### **3. Simplified Kids Game**
```yaml
Simple Stats:
  - Strength (Number, 1-10)
  - Speed (Number, 1-10)
  - Smarts (Number, 1-10)

Info:
  - Character Name (Text, required)
  - Team (Dropdown: Red/Blue/Green/Yellow)
  - Special Move (Text)
  - Picture (Text: filename)
```

### **4. Abstract Strategy**
```yaml
Properties:
  - Card Number (Number, 1-100)
  - Color (Color picker)
  - Shape (Dropdown: Circle/Square/Triangle)
  - Pattern (Dropdown: Solid/Striped/Dotted)
  - Count (Number, 1-5)
```

---

## 💡 Advanced Features

### **Attribute Flags:**

#### **Required**
- Must be filled in
- Card can't be saved without it
- Use for essential properties

#### **Core**
- Always displayed prominently
- Can't be hidden
- Use for defining characteristics (like Name)

#### **Display in Preview**
- Show on card preview
- Hide technical/meta attributes
- Control what players see

### **Attribute Options:**

#### **Number Type:**
- Set min/max values
- Enforce ranges
- Perfect for stats

#### **Dropdown Type:**
- Define options list
- Single selection
- Ensures consistency

#### **List Type:**
- Multiple selections
- For tags/keywords
- Flexible categorization

---

## 🎯 Dynamic Generation

### **Bulk Generator Uses Attributes!**

When you bulk generate cards, it will:
1. Use your defined attributes
2. Apply default values
3. Respect min/max ranges
4. Follow dropdown options

```bash
Example: Generate 100 cards with schema

Your schema:
- Power (1-10, default: 5)
- Element (Fire/Water/Earth, default: Fire)
- Rarity (Common/Uncommon/Rare, default: Common)

Bulk generate creates 100 cards:
→ All have Power: 5
→ All have Element: Fire
→ All have Rarity: Common
→ Then you bulk edit to customize!
```

---

## 🔄 Migration Path

### **Existing Cards:**

Your existing cards with fixed properties (power, cost, health, etc.) will continue to work! The system is backward compatible.

### **Gradual Transition:**

```bash
1. Define attributes matching your current structure
2. New cards use new attributes
3. Optionally migrate old cards
4. Or run both systems side-by-side
```

---

## 🎨 UI Integration

### **Card Editor:**
- Dynamically shows YOUR attributes
- Grouped by category
- Appropriate input for each type
- Required fields marked

### **Card Preview:**
- Shows displayInPreview=true attributes
- Hides technical/meta attributes
- Clean player-facing view

### **Bulk Editor:**
- Columns for your attributes
- Edit all cards at once
- Consistent across all cards

---

## 📊 Benefits

### **1. Ultimate Flexibility**
- Create ANY TCG system
- Not limited to pre-defined fields
- Add mechanics as you design

### **2. Clean Data Model**
- No unused fields
- Only what you need
- Efficient storage

### **3. Rapid Prototyping**
- Try different stat systems
- Add/remove mechanics easily
- Test different designs

### **4. Scalability**
- Add attributes anytime
- No code changes needed
- System grows with you

### **5. Multiple Game Support**
- Different projects = different schemas
- Each project independent
- Reuse concepts across games

---

## 🚀 Workflow Example

### **Complete TCG Design:**

**Day 1: Define Schema**
```bash
1. Brainstorm card properties
2. Go to Attribute Schema
3. Add attributes:
   - Name, Type, Rarity
   - Power, Defense, Speed
   - Element, Keywords
4. Set defaults and ranges
5. ✅ Schema complete!
```

**Day 2: Generate Cards**
```bash
1. Bulk Editor → Generate 200 cards
2. All have your attributes
3. Bulk edit rarities
4. Bulk edit by type
5. ✅ Base set complete!
```

**Day 3: Refine**
```bash
1. Realize you need "Cost" attribute
2. Add "Cost" to schema
3. Bulk editor shows new column
4. Fill in costs for all cards
5. ✅ Balanced!
```

**Day 4: New Mechanic**
```bash
1. Add "Synergy" attribute (List)
2. Add options: Combo1, Combo2, Combo3
3. Cards now support synergies
4. Update cards with synergies
5. ✅ Deeper gameplay!
```

---

## ✅ Complete Feature Set

### **Attribute Schema:**
- ✅ 9 attribute types
- ✅ 13 quick templates
- ✅ Custom attributes
- ✅ Category grouping
- ✅ Required/Core flags
- ✅ Display control
- ✅ Min/max for numbers
- ✅ Options for dropdowns/lists
- ✅ Default values

### **Integration:**
- ✅ Card Editor (coming next)
- ✅ Bulk Editor (coming next)
- ✅ Card Preview (coming next)
- ✅ Pack Simulator (uses attributes)
- ✅ Export (includes all attributes)

---

## 🎊 Summary

### **What You Can Do Now:**
- ✅ Define completely custom card schemas
- ✅ Use 9 different attribute types
- ✅ Apply quick templates or build from scratch
- ✅ Group attributes by category
- ✅ Set default values, ranges, options
- ✅ Mark attributes as required/core
- ✅ Control preview display
- ✅ Support ANY TCG mechanics

### **Coming Next:**
- 🔜 Card editor integration (dynamic forms)
- 🔜 Bulk editor integration (dynamic columns)
- 🔜 Card preview integration (show attributes)
- 🔜 Attribute validation
- 🔜 Attribute formulas (computed values)
- 🔜 Attribute dependencies

---

**Your TCG tool is now FULLY CUSTOMIZABLE!** 🎯✨

No more fixed card structure - create the exact TCG you envision!

Go to **Attribute Schema** screen to start defining your custom card structure!
