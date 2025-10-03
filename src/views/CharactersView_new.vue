<template>
  <div class="characters-page">
    <!-- Background Effects -->
    <div class="bg-stars"></div>
    <div class="bg-nebula"></div>
    
    <div class="characters-layout">
      <!-- Red Zone: Faction Area -->
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
            <small>Select resonators to reveal faction</small>
          </div>
        </div>
      </div>

      <!-- Blue Zone: Resonator Navigation (Max 3) -->
      <div class="resonator-nav-area">
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
        
        <div class="resonator-nav-content">
          <button 
            class="nav-arrow left" 
            @click="previousResonator"
            :disabled="currentResonatorIndex === 0"
            v-if="currentFactionResonators.length > 3"
          >
            ‹
          </button>

          <div class="resonator-showcase">
            <div 
              v-for="(resonator, index) in visibleResonators" 
              :key="resonator.id"
              class="resonator-card"
              :class="{ 
                active: selectedResonator?.id === resonator.id,
                center: index === 1 && visibleResonators.length === 3
              }"
              @click="selectResonator(resonator)"
            >
              <div class="resonator-image">
                <img :src="resonator.portrait" :alt="resonator.name" />
                <div class="element-badge" :class="resonator.element"></div>
              </div>
              <div class="resonator-info">
                <h4>{{ resonator.name }}</h4>
                <p>{{ resonator.title }}</p>
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

      <!-- Yellow Zone: Resonator Lore -->
      <div class="lore-area">
        <div class="lore-content">
          <div v-if="selectedResonator" class="lore-display">
            <h3>{{ selectedResonator.name }}</h3>
            <p class="resonator-weapon">{{ selectedResonator.weapon }} • {{ selectedResonator.element }}</p>
            <div class="lore-text">
              <p>{{ selectedResonator.story }}</p>
            </div>
            <blockquote class="resonator-quote">
              "{{ selectedResonator.quote }}"
            </blockquote>
          </div>
          <div v-else class="no-lore">
            <p>Resonator lore will appear here</p>
          </div>
        </div>
      </div>

      <!-- Green Zone: Skill Demos -->
      <div class="skills-area">
        <div class="skills-content">
          <div v-if="selectedResonator" class="skills-display">
            <h3>Resonance Abilities</h3>
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
      },
      {
        id: 4,
        name: "Baizhi",
        title: "Verdant Summit",
        element: "glacio",
        weapon: "rectifier",
        rarity: 4,
        portrait: "/images/bg-other.png",
        fullImage: "/images/bg-home.png",
        story: "A researcher at Huaxu Academy with a calm and analytical mind. She studies Tacet Discords and their impact on the world.",
        quote: "Knowledge is the key to understanding our world's mysteries.",
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
        id: 5,
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
        id: 6,
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
        id: 7,
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

// Initialize with first faction
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
    radial-gradient(circle, rgba(196, 172, 125, 0.8) 1px, transparent 1px),
    radial-gradient(circle, rgba(196, 172, 125, 0.4) 0.5px, transparent 1px);
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
    "faction resonators"
    "lore skills";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: calc(100vh - 53px);
  gap: 15px;
  padding: 15px;
  position: relative;
  z-index: 10;
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

/* Blue Zone: Resonator Navigation */
.resonator-nav-area {
  grid-area: resonators;
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

.faction-btn {
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

.faction-btn:hover {
  background: rgba(196, 172, 125, 0.2);
  border-color: rgba(196, 172, 125, 0.5);
}

.faction-btn.active {
  background: rgba(196, 172, 125, 0.3);
  border-color: var(--gold);
  color: var(--gold);
  box-shadow: 0 0 15px rgba(196, 172, 125, 0.3);
}

.resonator-nav-content {
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

.resonator-showcase {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.resonator-card {
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

.resonator-card:hover {
  border-color: rgba(196, 172, 125, 0.4);
  background: rgba(196, 172, 125, 0.1);
  transform: translateY(-5px);
}

.resonator-card.active {
  border-color: var(--gold);
  background: rgba(196, 172, 125, 0.15);
  box-shadow: 0 0 20px rgba(196, 172, 125, 0.3);
  transform: translateY(-8px) scale(1.05);
}

.resonator-image {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(196, 172, 125, 0.4);
}

.resonator-image img {
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

.resonator-info h4 {
  color: var(--gold);
  font-size: 1rem;
  margin: 0;
  text-align: center;
}

.resonator-info p {
  color: var(--parchment);
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.8;
  text-align: center;
}

/* Yellow Zone: Resonator Lore */
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

.resonator-weapon {
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

.resonator-quote {
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

/* Element Colors - Wuthering Waves */
.element-badge.glacio, .skill-icon.glacio { background: #4FC3F7; }
.element-badge.fusion, .skill-icon.fusion { background: #FF5722; }
.element-badge.electro, .skill-icon.electro { background: #9C27B0; }
.element-badge.aero, .skill-icon.aero { background: #4CAF50; }
.element-badge.spectro, .skill-icon.spectro { background: #FFEB3B; }
.element-badge.havoc, .skill-icon.havoc { background: #E91E63; }

/* Responsive Design */
@media (max-width: 1200px) {
  .characters-layout {
    gap: 10px;
    padding: 10px;
  }
  
  .faction-area, .resonator-nav-area, .lore-area, .skills-area {
    padding: 15px;
  }
  
  .resonator-card {
    min-width: 100px;
    max-width: 120px;
  }
  
  .resonator-image {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 768px) {
  .characters-layout {
    grid-template-areas: 
      "faction"
      "resonators" 
      "lore"
      "skills";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
  }
  
  .resonator-showcase {
    flex-direction: column;
    gap: 10px;
  }
  
  .resonator-card {
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
</style>