<template>
  <div class="characters-page">
    <!-- Background Effects -->
    <div class="bg-stars"></div>
    <div class="bg-nebula"></div>
    
    <div class="characters-layout">
      <!-- Red Zone: Faction Images -->
      <div class="faction-area">
        <div class="faction-content">
          <div v-if="selectedFaction" class="faction-display">
            <div class="faction-crosshair">⊕</div>
            <img :src="selectedFaction.icon" :alt="selectedFaction.name" class="faction-image" />
            <div class="faction-info">
              <h2>{{ selectedFaction.name }}</h2>
              <p>{{ selectedFaction.description }}</p>
            </div>
          </div>
          <div v-else class="no-faction">
            <div class="crosshair-placeholder">⊕</div>
            <p>UNKNOWN</p>
            <small>Select characters to reveal faction</small>
          </div>
        </div>
      </div>

      <!-- Blue Zone: Character Navigation (Max 3) -->
      <div class="character-nav-area">
        <div class="nav-header">
          <button 
            v-for="faction in factions" 
            :key="faction.id"
            class="faction-btn"
            :class="{ active: selectedFaction?.id === faction.id }"
            @click="selectFaction(faction)"
          >
            {{ faction.name }}
          </button>
        </div>
        
        <div class="character-nav-content">
          <button 
            class="nav-arrow left" 
            @click="previousResonator"
            :disabled="currentResonatorIndex === 0"
            v-if="currentFactionResonators.length > 3"
          >
            ‹
          </button>

          <div class="character-showcase">
            <div 
              v-for="(character, index) in visibleResonators" 
              :key="character.id"
              class="character-card"
              :class="{ 
                active: selectedResonator?.id === character.id,
                center: index === 1 && visibleResonators.length === 3
              }"
              @click="selectResonator(character)"
            >
              <div class="character-image">
                <img :src="character.portrait" :alt="character.name" />
                <div class="element-badge" :class="character.element"></div>
              </div>
              <div class="character-info">
                <h4>{{ character.name }}</h4>
                <p>{{ character.title }}</p>
              </div>
            </div>
          </div>

          <button 
            class="nav-arrow right" 
            @click="nextResonator"
            :disabled="currentResonatorIndex >= currentFactionResonators.length - 3"
            v-if="currentFactionResonators.length > 3"
          >
            ›
          </button>
        </div>
      </div>

      <!-- Yellow Zone: Character Lore -->
      <div class="lore-area">
        <div class="lore-content">
          <div v-if="selectedResonator" class="lore-display">
            <h3>{{ selectedResonator.name }}</h3>
            <p class="character-path">{{ selectedResonator.title }}</p>
            <div class="lore-text">
              <p>{{ selectedResonator.story }}</p>
            </div>
            <blockquote class="character-quote">
              "{{ selectedResonator.quote }}"
            </blockquote>
          </div>
          <div v-else class="no-lore">
            <p>Character lore will appear here</p>
          </div>
        </div>
      </div>

      <!-- Green Zone: Skill Demos -->
      <div class="skills-area">
        <div class="skills-content">
          <div v-if="selectedResonator" class="skills-display">
            <h3>Combat Abilities</h3>
            <div class="skill-demo">
              <div class="demo-frame">
                <div class="demo-placeholder">
                  <div class="skill-icon" :class="selectedResonator.element">
                    {{ selectedResonator.element.charAt(0).toUpperCase() }}
                  </div>
                  <p>{{ selectedResonator.element.toUpperCase() }} RESONANCE</p>
                  <small>{{ selectedResonator.name }}'s combat demonstration</small>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-skills">
            <div class="skills-placeholder">
              <p>Skill demonstrations</p>
              <small>Combat abilities preview</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types - Wuthering Waves
interface Resonator {
  id: number
  name: string
  title: string
  element: 'glacio' | 'fusion' | 'electro' | 'aero' | 'spectro' | 'havoc'
  weapon: 'sword' | 'broadblade' | 'pistols' | 'gauntlets' | 'rectifier'
  rarity: number
  portrait: string
  fullImage: string
  story: string
  quote: string
  factionId: string
}

interface Faction {
  id: string
  name: string
  description: string
  icon: string
  resonators: Resonator[]
}

// Reactive data
const selectedFaction = ref<Faction | null>(null)
const selectedResonator = ref<Resonator | null>(null)
const currentResonatorIndex = ref(0)

// Wuthering Waves factions and resonators data
const factions = ref<Faction[]>([
  {
    id: 'jinzhou',
    name: 'Jinzhou',
    description: 'The main city and governing body of Huanglong',
    icon: '/images/bg-home.png',
    resonators: [
      {
        id: 1,
        name: "Rover",
        title: "The Awakened Wanderer",
        element: "spectro",
        weapon: "sword",
        rarity: 5,
        portrait: "/images/bg-home.png",
        fullImage: "/images/bg-other.png",
        story: "A mysterious individual who awakened in an unfamiliar world with no memory of their past. Possessing the rare ability to resonate with multiple frequencies.",
        quote: "The echoes guide me forward, even when the path is unclear.",
        factionId: 'jinzhou'
      },
      {
        id: 2,
        name: "Yangyang",
        title: "Soaring Wind",
        element: "aero",
        weapon: "sword",
        rarity: 4,
        portrait: "/images/bg-other.png",
        fullImage: "/images/bg-home.png",
        story: "A Midnight Rangers member with exceptional tracking skills. Her cheerful demeanor hides a determined spirit to protect those she cares about.",
        quote: "The wind carries both hope and responsibility.",
        factionId: 'jinzhou'
      },
      {
        id: 3,
        name: "Chixia",
        title: "Blazing Ranger",
        element: "fusion",
        weapon: "pistols",
        rarity: 4,
        portrait: "/images/bg-home.png",
        fullImage: "/images/bg-other.png",
        story: "An energetic Jinzhou Patroller who dreams of becoming a hero. Her fiery personality matches her explosive combat style.",
        quote: "Justice burns bright in my heart!",
        factionId: 'jinzhou'
      }
    ]
  },
  {
    id: 'black-shores',
    name: 'Black Shores',
    description: 'A mysterious research organization focused on Tacet Discord studies',
    icon: '/images/bg-other.png',
    resonators: [
      {
        id: 4,
        name: "Shorekeeper",
        title: "Keeper of the Black Shores",
        element: "spectro",
        weapon: "rectifier",
        rarity: 5,
        portrait: "/images/bg-other.png",
        fullImage: "/images/bg-home.png",
        story: "The enigmatic guardian of the Black Shores, wielding ancient knowledge and spectro resonance abilities beyond comprehension.",
        quote: "Time flows like the tide, but some shores remain eternal.",
        factionId: 'black-shores'
      },
      {
        id: 5,
        name: "Camellya",
        title: "Seed of Fate",
        element: "havoc",
        weapon: "sword",
        rarity: 5,
        portrait: "/images/bg-home.png",
        fullImage: "/images/bg-other.png",
        story: "A mysterious individual with ties to the Fractsidus. Her past is shrouded in secrets, but her power over havoc frequencies is undeniable.",
        quote: "Destruction and creation are two sides of the same bloom.",
        factionId: 'black-shores'
      }
    ]
  },
  {
    id: 'fractsidus',
    name: 'Fractsidus',
    description: 'A radical organization seeking to reshape the world through Tacet Discord',
    icon: '/images/bg-home.png',
    resonators: [
      {
        id: 6,
        name: "Scar",
        title: "Fractured Overture",
        element: "spectro",
        weapon: "rectifier",
        rarity: 5,
        portrait: "/images/bg-other.png",
        fullImage: "/images/bg-home.png",
        story: "A high-ranking member of Fractsidus who conducts experiments with Tacet Discord. His scarred appearance tells the story of countless battles.",
        quote: "Through discord, we shall find harmony in chaos.",
        factionId: 'fractsidus'
      }
    ]
  }
])

// Computed properties
const currentFactionResonators = computed(() => {
  return selectedFaction.value?.resonators || []
})

const visibleResonators = computed(() => {
  const resonators = currentFactionResonators.value
  if (resonators.length <= 3) {
    return resonators
  }
  
  const start = Math.max(0, Math.min(currentResonatorIndex.value, resonators.length - 3))
  return resonators.slice(start, start + 3)
})

// Methods
const selectFaction = (faction: Faction) => {
  selectedFaction.value = faction
  currentResonatorIndex.value = 0
  // Auto select first resonator of the faction
  if (faction.resonators.length > 0) {
    selectedResonator.value = faction.resonators[0]
  } else {
    selectedResonator.value = null
  }
}

const selectResonator = (resonator: Resonator) => {
  selectedResonator.value = resonator
  currentResonatorIndex.value = currentFactionResonators.value.findIndex(r => r.id === resonator.id)
}

const previousResonator = () => {
  const resonators = currentFactionResonators.value
  if (currentResonatorIndex.value > 0) {
    currentResonatorIndex.value--
    selectedResonator.value = resonators[currentResonatorIndex.value]
  }
}

const nextResonator = () => {
  const resonators = currentFactionResonators.value
  if (currentResonatorIndex.value < resonators.length - 1) {
    currentResonatorIndex.value++
    selectedResonator.value = resonators[currentResonatorIndex.value]
  }
}

onMounted(() => {
  if (factions.value.length > 0) {
    selectFaction(factions.value[0])
  }
})
</script>

<style scoped>
.characters-page {
  height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(196, 172, 125, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(196, 172, 125, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(196, 172, 125, 0.02) 0%, transparent 50%),
    linear-gradient(135deg, rgba(196, 172, 125, 0.01) 0%, rgba(11, 11, 11, 0.8) 100%),
    var(--bg);
  color: var(--parchment);
  padding-top: 53px;
  position: relative;
  overflow: hidden;
}

/* Background Effects */
.bg-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    radial-gradient(circle, rgba(196, 172, 125, 0.6) 1px, transparent 1px);
  background-size: 150px 150px, 300px 300px;
  background-position: 0 0, 75px 75px;
  animation: starTwinkle 20s linear infinite;
  z-index: 1;
}

.bg-nebula {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at top left, rgba(196, 172, 125, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(196, 172, 125, 0.12) 0%, transparent 50%);
  animation: nebulaFlow 30s ease-in-out infinite;
  z-index: 2;
}

@keyframes starTwinkle {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 1; }
  25% { transform: translateY(-10px) translateX(5px); opacity: 0.8; }
  50% { transform: translateY(0) translateX(-5px); opacity: 0.6; }
  75% { transform: translateY(10px) translateX(3px); opacity: 0.9; }
}

@keyframes nebulaFlow {
  0%, 100% { transform: scale(1) rotate(0deg); }
  33% { transform: scale(1.1) rotate(120deg); }
  66% { transform: scale(0.9) rotate(240deg); }
}

/* Main Layout - Wuthering Waves Style */
.characters-layout {
  display: grid;
  grid-template-areas: 
    "sidebar main-top"
    "sidebar main-bottom";
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr 1fr;
  height: calc(100vh - 53px);
  gap: 15px;
  padding: 15px;
  position: relative;
  z-index: 10;
}

.main-content {
  display: grid;
  grid-template-areas: 
    "center-area characters"
    "lore skills";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
}

/* Red Zone: Faction Area */
.faction-area {
  grid-area: faction;
  background: rgba(196, 172, 125, 0.08);
  border: 2px solid rgba(196, 172, 125, 0.3);
  border-radius: 15px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.faction-content {
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.faction-display {
  position: relative;
}

.faction-crosshair {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem;
  color: var(--gold);
  opacity: 0.6;
}

.faction-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid var(--gold);
  object-fit: cover;
  filter: drop-shadow(0 0 20px rgba(196, 172, 125, 0.5));
}

.faction-info h2 {
  color: var(--gold);
  font-size: 2rem;
  margin: 20px 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.faction-info p {
  color: var(--parchment);
  opacity: 0.8;
  font-size: 1rem;
}

.no-faction {
  opacity: 0.5;
}

.crosshair-placeholder {
  font-size: 4rem;
  color: var(--gold);
  opacity: 0.3;
  margin-bottom: 20px;
}

.no-faction p {
  font-size: 1.5rem;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.no-faction small {
  color: var(--parchment);
  opacity: 0.6;
}

/* Blue Zone: Character Navigation */
.character-nav-area {
  grid-area: characters;
  background: rgba(196, 172, 125, 0.08);
  border: 2px solid rgba(196, 172, 125, 0.3);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-header {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.location-btn {
  background: rgba(196, 172, 125, 0.1);
  border: 1px solid rgba(196, 172, 125, 0.3);
  color: var(--parchment);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.location-btn:hover {
  background: rgba(196, 172, 125, 0.2);
  border-color: rgba(196, 172, 125, 0.5);
}

.location-btn.active {
  background: rgba(196, 172, 125, 0.3);
  border-color: var(--gold);
  color: var(--gold);
  box-shadow: 0 0 15px rgba(196, 172, 125, 0.3);
}

.character-nav-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex: 1;
}

.nav-arrow {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(196, 172, 125, 0.4);
  background: rgba(196, 172, 125, 0.1);
  color: var(--gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-arrow:hover:not(:disabled) {
  background: rgba(196, 172, 125, 0.2);
  border-color: var(--gold);
  transform: scale(1.1);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.character-showcase {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.character-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 2px solid rgba(196, 172, 125, 0.2);
  border-radius: 12px;
  background: rgba(196, 172, 125, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  max-width: 140px;
}

.character-card:hover {
  border-color: rgba(196, 172, 125, 0.4);
  background: rgba(196, 172, 125, 0.1);
  transform: translateY(-5px);
}

.character-card.active {
  border-color: var(--gold);
  background: rgba(196, 172, 125, 0.15);
  box-shadow: 0 0 20px rgba(196, 172, 125, 0.3);
  transform: translateY(-8px) scale(1.05);
}

.character-card.center {
  transform: translateY(-10px) scale(1.1);
}

.character-card.center.active {
  transform: translateY(-15px) scale(1.15);
}

.character-image {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(196, 172, 125, 0.4);
}

.character-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.element-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(11, 11, 11, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

.character-info h4 {
  color: var(--gold);
  font-size: 1rem;
  margin: 0;
  text-align: center;
}

.character-info p {
  color: var(--parchment);
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.8;
  text-align: center;
}

/* Yellow Zone: Character Lore */
.lore-area {
  grid-area: lore;
  background: rgba(196, 172, 125, 0.08);
  border: 2px solid rgba(196, 172, 125, 0.3);
  border-radius: 15px;
  padding: 25px;
  overflow-y: auto;
}

.lore-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.lore-display h3 {
  color: var(--gold);
  font-size: 1.8rem;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 2px solid rgba(196, 172, 125, 0.3);
  padding-bottom: 10px;
}

.character-path {
  color: rgba(196, 172, 125, 0.8);
  font-style: italic;
  font-size: 1rem;
  margin: 0 0 20px 0;
  text-transform: capitalize;
}

.lore-text {
  flex: 1;
  margin-bottom: 20px;
}

.lore-text p {
  color: var(--parchment);
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
}

.character-quote {
  background: rgba(196, 172, 125, 0.1);
  border-left: 4px solid var(--gold);
  padding: 15px 20px;
  border-radius: 0 10px 10px 0;
  font-style: italic;
  color: var(--gold);
  font-size: 1.1rem;
  margin: 0;
  position: relative;
}

.character-quote::before {
  content: '"';
  position: absolute;
  left: 10px;
  top: -5px;
  font-size: 2rem;
  color: var(--gold);
  opacity: 0.5;
}

.character-quote::after {
  content: '"';
  position: absolute;
  right: 10px;
  bottom: -15px;
  font-size: 2rem;
  color: var(--gold);
  opacity: 0.5;
}

.no-lore {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--parchment);
  opacity: 0.5;
  font-style: italic;
}

/* Green Zone: Skills Area */
.skills-area {
  grid-area: skills;
  background: rgba(196, 172, 125, 0.08);
  border: 2px solid rgba(196, 172, 125, 0.3);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.skills-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.skills-display h3 {
  color: var(--gold);
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
}

.skill-demo {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-frame {
  width: 100%;
  height: 200px;
  background: rgba(11, 11, 11, 0.6);
  border: 2px solid rgba(196, 172, 125, 0.4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.demo-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(196, 172, 125, 0.2), transparent);
  animation: skillScan 3s ease-in-out infinite;
}

@keyframes skillScan {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

.demo-placeholder {
  text-align: center;
  z-index: 1;
  position: relative;
}

.skill-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  border: 3px solid var(--gold);
  background: rgba(196, 172, 125, 0.2);
  animation: skillPulse 2s ease-in-out infinite;
}

@keyframes skillPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(196, 172, 125, 0.3); }
  50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(196, 172, 125, 0.6); }
}

.demo-placeholder p {
  color: var(--gold);
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 5px 0;
  letter-spacing: 0.1em;
}

.demo-placeholder small {
  color: var(--parchment);
  opacity: 0.7;
  font-style: italic;
}

.no-skills {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.skills-placeholder {
  text-align: center;
  color: var(--parchment);
  opacity: 0.5;
}

.skills-placeholder p {
  font-size: 1.2rem;
  margin: 0 0 5px 0;
}

.skills-placeholder small {
  font-style: italic;
}

/* Element Colors */
.element-badge.fire, .skill-icon.fire { background: #ef4444; }
.element-badge.ice, .skill-icon.ice { background: #06b6d4; }
.element-badge.lightning, .skill-icon.lightning { background: #8b5cf6; }
.element-badge.wind, .skill-icon.wind { background: #10b981; }
.element-badge.quantum, .skill-icon.quantum { background: #6366f1; }
.element-badge.imaginary, .skill-icon.imaginary { background: #f59e0b; }
.element-badge.physical, .skill-icon.physical { background: #6b7280; }

/* Responsive Design */
@media (max-width: 1200px) {
  .characters-layout {
    gap: 10px;
    padding: 10px;
  }
  
  .faction-area, .character-nav-area, .lore-area, .skills-area {
    padding: 15px;
  }
  
  .character-card {
    min-width: 100px;
    max-width: 120px;
  }
  
  .character-image {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 768px) {
  .characters-layout {
    grid-template-areas: 
      "faction"
      "characters" 
      "lore"
      "skills";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
  }
  
  .character-showcase {
    flex-direction: column;
    gap: 10px;
  }
  
  .character-card {
    flex-direction: row;
    align-items: center;
    gap: 15px;
    min-width: auto;
    max-width: none;
    width: 100%;
  }
  
  .nav-header {
    flex-direction: column;
    gap: 8px;
  }
}

/* Locations Navigation - Dark Gold Mysterious */
.locations-nav {
  background: rgba(11, 11, 11, 0.95);
  backdrop-filter: blur(15px);
  border-right: 1px solid rgba(196, 172, 125, 0.4);
  padding: 2rem 1rem;
  overflow-y: auto;
  border-radius: 0 20px 20px 0;
}

.nav-title {
  color: var(--gold);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 0.1em;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(196, 172, 125, 0.08);
  border: 1px solid rgba(196, 172, 125, 0.25);
  position: relative;
  overflow: hidden;
}

.location-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--gold), rgba(196, 172, 125, 0.6));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.location-item:hover {
  background: rgba(196, 172, 125, 0.15);
  border-color: rgba(196, 172, 125, 0.5);
  transform: translateX(5px);
}

.location-item:hover::before {
  opacity: 1;
}

.location-item.active {
  background: rgba(196, 172, 125, 0.25);
  border-color: var(--gold);
  transform: translateX(10px);
  box-shadow: 0 0 25px rgba(196, 172, 125, 0.4);
}

.location-item.active::before {
  opacity: 1;
}

.location-icon {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(196, 172, 125, 0.6);
  background: rgba(196, 172, 125, 0.1);
}

.location-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-element {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
  border: 2px solid rgba(15, 23, 42, 0.9);
}

.character-element.fire { background: #ef4444; }
.character-element.ice { background: #06b6d4; }
.character-element.lightning { background: #8b5cf6; }
.character-element.wind { background: #10b981; }
.character-element.quantum { background: #6366f1; }
.character-element.imaginary { background: #f59e0b; }
.character-element.physical { background: #6b7280; }

.location-info h3 {
  color: var(--gold);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.location-info p {
  color: rgba(242, 233, 218, 0.7);
  font-size: 0.8rem;
  margin: 0;
}

/* Main Character Display */
.character-main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.character-display {
  display: grid;
  grid-template-areas: 
    "hero story"
    "nav nav";
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr auto;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  height: 100%;
}

/* Character Hero (Green Area) */
.character-hero {
  grid-area: hero;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.character-hero img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  filter: drop-shadow(0 0 30px rgba(196, 172, 125, 0.3));
  transition: all 0.5s ease;
}

.character-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  border-radius: 50%;
  opacity: 0.1;
  animation: pulse 3s ease-in-out infinite;
  pointer-events: none;
}

.character-glow.fire { background: radial-gradient(circle, #ef4444, transparent); }
.character-glow.ice { background: radial-gradient(circle, #06b6d4, transparent); }
.character-glow.lightning { background: radial-gradient(circle, #8b5cf6, transparent); }
.character-glow.wind { background: radial-gradient(circle, #10b981, transparent); }
.character-glow.quantum { background: radial-gradient(circle, #6366f1, transparent); }
.character-glow.imaginary { background: radial-gradient(circle, #f59e0b, transparent); }
.character-glow.physical { background: radial-gradient(circle, #6b7280, transparent); }

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
}

/* Story Panel (Yellow Area) */
.story-panel {
  grid-area: story;
  background: rgba(245, 158, 11, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.story-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.02));
  border-radius: 20px;
  pointer-events: none;
}

.story-content {
  position: relative;
  z-index: 1;
}

.story-content h3 {
  color: rgba(245, 158, 11, 0.9);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
}

.location-desc {
  color: rgba(242, 233, 218, 0.8);
  font-style: italic;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.character-story h4 {
  color: var(--gold);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.character-story p {
  line-height: 1.6;
  color: rgba(242, 233, 218, 0.9);
  margin-bottom: 1.5rem;
}

.character-quote {
  font-style: italic;
  font-size: 1rem;
  color: rgba(245, 158, 11, 0.9);
  text-align: center;
  padding: 1rem;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.05);
}



/* Character Navigation (Red Area) */
.character-navigation {
  grid-area: nav;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(196, 172, 125, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
}

.character-navigation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(196, 172, 125, 0.05), rgba(196, 172, 125, 0.02), rgba(196, 172, 125, 0.05));
  border-radius: 20px;
  pointer-events: none;
}

.nav-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid rgba(196, 172, 125, 0.5);
  background: rgba(196, 172, 125, 0.15);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  font-weight: bold;
  position: relative;
  z-index: 2;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(196, 172, 125, 0.25);
  border-color: var(--gold);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(196, 172, 125, 0.4);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.character-thumbnails {
  display: flex;
  gap: 0.8rem;
  flex: 1;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.thumbnail {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid rgba(196, 172, 125, 0.4);
  opacity: 0.7;
}

.thumbnail:hover {
  opacity: 0.9;
  transform: scale(1.1);
  border-color: rgba(196, 172, 125, 0.6);
}

.thumbnail.active {
  opacity: 1;
  transform: scale(1.2);
  border-color: var(--gold);
  box-shadow: 0 0 25px rgba(196, 172, 125, 0.5);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.char-element {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(15, 23, 42, 0.9);
}

.char-element.fire { background: #ef4444; }
.char-element.ice { background: #06b6d4; }
.char-element.lightning { background: #8b5cf6; }
.char-element.wind { background: #10b981; }
.char-element.quantum { background: #6366f1; }
.char-element.imaginary { background: #f59e0b; }
.char-element.physical { background: #6b7280; }

/* Responsive */
@media (max-width: 1024px) {
  .characters-layout {
    grid-template-columns: 250px 1fr;
  }
  
  .character-display {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "hero"
      "story"
      "nav";
    gap: 1.5rem;
  }
  
  .story-panel {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .characters-layout {
    grid-template-columns: 1fr;
  }
  
  .locations-nav {
    display: none;
  }
  
  .character-main {
    padding: 1rem;
  }
  
  .character-display {
    grid-template-areas: 
      "nav"
      "hero"
      "story";
  }
  
  .character-hero {
    min-height: 300px;
  }
  
  .character-navigation {
    padding: 1rem;
  }
  
  .character-thumbnails {
    gap: 0.5rem;
  }
  
  .thumbnail {
    width: 50px;
    height: 50px;
  }
}
</style>
