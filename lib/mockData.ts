export interface NewsItem {
  title: string
  image: string
  category: string
  description: string
  content: string
  link: string
  seccion: string
  date: string
}

export const mockNews: NewsItem[] = [
  {
    title: 'Championship Victory: Historic Win in Stunning Final',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'Football',
    description: 'An incredible performance in the championship match ends with a memorable victory for the home team.',
    content: '<p>In one of the most thrilling matches of the season, the home team secured a championship victory with a stunning final performance. The match showcased exceptional skill, determination, and teamwork.</p><p>From the opening whistle, both teams displayed their commitment to winning. The momentum shifted several times throughout the match, keeping fans on the edge of their seats.</p><p>The decisive moment came in the final minutes when the team executed a perfect play that left the opposing defense unable to respond. The crowd erupted as the winning goal was scored.</p><p>"This is what we worked for all season," said the team captain after the match. "Every player gave their absolute best, and it paid off."</p>',
    link: 'championship-victory-historic-win',
    seccion: 'futbol',
    date: 'April 15, 2025',
  },
  {
    title: 'Star Player Signs Record-Breaking Contract',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'News',
    description: 'One of the league\'s most talented players signs a groundbreaking multi-year contract.',
    content: '<p>In a shocking move that sent shockwaves through the sports world, one of the league\'s brightest stars has signed a record-breaking contract with one of the major franchises.</p><p>The deal is considered the most lucrative in the history of the sport, reflecting the player\'s exceptional talent and market value.</p><p>"I\'m thrilled to join this organization," the player stated. "The facilities, coaching staff, and team culture align perfectly with my goals."</p><p>Industry experts believe this signing will have major implications for the upcoming season and the competitive balance within the league.</p>',
    link: 'star-player-record-contract',
    seccion: 'news',
    date: 'April 14, 2025',
  },
  {
    title: 'Underdog Team Makes Stunning Playoff Run',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'Sports',
    description: 'Against all odds, an underdog team defies expectations and advances deep into the playoffs.',
    content: '<p>In a Cinderella story that has captured the hearts of fans everywhere, an underdog team has made an improbable run through the playoffs.</p><p>Starting the season with low expectations, the team has shown incredible resilience and determination, defeating several top-seeded opponents along the way.</p><p>The team\'s success has been built on solid defense, strategic plays, and the unshakeable belief of both players and coaching staff.</p><p>As they prepare for the next round, the team remains focused on their goal: bringing home the championship.</p>',
    link: 'underdog-playoff-run',
    seccion: 'sports',
    date: 'April 13, 2025',
  },
  {
    title: 'Athletes Speak Out About Mental Health in Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'News',
    description: 'Leading athletes discuss the importance of mental wellness in professional sports.',
    content: '<p>Several high-profile athletes have come together to discuss the critical importance of mental health in professional sports.</p><p>The panel emphasized that psychological wellness is just as important as physical training and conditioning.</p><p>"Breaking the stigma around mental health has been transformative for me," one athlete shared. "I\'m grateful for the support system in place."</p><p>The discussion has sparked important conversations within sports organizations about providing comprehensive mental health support.</p>',
    link: 'athletes-mental-health',
    seccion: 'news',
    date: 'April 12, 2025',
  },
  {
    title: 'Tennis Grand Slam: New Champion Crowned',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'Tennis',
    description: 'An exciting grand slam tournament concludes with an unexpected champion.',
    content: '<p>The prestigious grand slam tournament has concluded with a new champion being crowned in an exciting final match.</p><p>The winner displayed exceptional form throughout the tournament, defeating several seeded players along the way.</p><p>The final was a nail-biter that went into multiple sets, with both players showing incredible skill and determination.</p><p>"I\'m honored to win this championship," the new champion said. "This trophy represents hard work and dedication."</p>',
    link: 'tennis-grand-slam-champion',
    seccion: 'tennis',
    date: 'April 11, 2025',
  },
  {
    title: 'Training Methods: What Elite Athletes Do Differently',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'Sports',
    description: 'Explore the advanced training techniques used by world-class athletes.',
    content: '<p>Elite athletes employ specialized training methods that set them apart from the competition.</p><p>These methods include advanced sports science, personalized nutrition plans, recovery protocols, and mental conditioning.</p><p>Professional coaches work closely with athletes to optimize every aspect of their performance.</p><p>The investment in these advanced techniques often translates to marginal gains that add up to significant advantages in competition.</p>',
    link: 'elite-training-methods',
    seccion: 'sports',
    date: 'April 10, 2025',
  },
  {
    title: 'Basketball Highlights: Top 10 Moments This Season',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'Basketball',
    description: 'Review the most exciting basketball moments from this season.',
    content: '<p>This season has provided fans with unforgettable basketball moments that will be remembered for years to come.</p><p>From incredible buzzer-beaters to record-breaking performances, the season has delivered excitement and drama.</p><p>Players have pushed the boundaries of what\'s possible on the court, showcasing skill at the highest level.</p><p>As the season progresses, anticipation builds for what other amazing moments await us.</p>',
    link: 'basketball-season-highlights',
    seccion: 'basketball',
    date: 'April 9, 2025',
  },
  {
    title: 'Women in Sports: Breaking Barriers and Setting Records',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'News',
    description: 'Female athletes continue to break barriers and achieve historic accomplishments.',
    content: '<p>Women athletes around the world are continuing to break barriers and set new records in their respective sports.</p><p>The year has seen numerous historic achievements that demonstrate the incredible talent and determination of female athletes.</p><p>These accomplishments inspire young athletes and help grow the sport at all levels.</p><p>As more resources and recognition are given to women\'s sports, the quality of competition continues to rise.</p>',
    link: 'women-sports-records',
    seccion: 'news',
    date: 'April 8, 2025',
  },
  {
    title: 'Young Phenom Makes Professional Debut',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'Football',
    description: 'A rising star makes their professional debut in impressive fashion.',
    content: '<p>A highly touted young talent has made their professional debut, and the performance exceeded expectations.</p><p>The player showed maturity beyond their years, adapting quickly to the professional level.</p><p>"I\'m just trying to do my job and help the team win," the young athlete said modestly after the match.</p><p>Scouts and analysts believe this is just the beginning of what could be a stellar professional career.</p>',
    link: 'young-talent-professional-debut',
    seccion: 'futbol',
    date: 'April 7, 2025',
  },
  {
    title: 'Injury Recovery: Athlete Returns to Competition',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'Sports',
    description: 'A veteran athlete makes a successful return after major injury recovery.',
    content: '<p>After months of rehabilitation and recovery, a beloved athlete has returned to competition.</p><p>The comeback was marked by an impressive performance that showed the athlete is back to previous form.</p><p>"The support from fans and teammates helped me through this journey," the athlete said gratefully.</p><p>The return marks an important milestone both for the athlete and for the team\'s championship aspirations.</p>',
    link: 'athlete-injury-recovery',
    seccion: 'sports',
    date: 'April 6, 2025',
  },
  {
    title: 'International Tournament Results and Analysis',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'Football',
    description: 'Key results from the international tournament with expert analysis.',
    content: '<p>The international tournament has produced exciting matches and surprising results.</p><p>Teams are adapting their strategies based on early tournament performances and opponent analysis.</p><p>Star players are beginning to emerge as key factors in their team\'s success.</p><p>As the tournament progresses, the competition intensifies and every match becomes crucial.</p>',
    link: 'international-tournament-results',
    seccion: 'futbol',
    date: 'April 5, 2025',
  },
  {
    title: 'Sports Technology: Innovation on the Field',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    category: 'News',
    description: 'Explore the latest technological innovations being used in professional sports.',
    content: '<p>Technology continues to play an increasingly important role in professional sports.</p><p>From advanced analytics to real-time performance monitoring, teams are leveraging cutting-edge tools.</p><p>These innovations help athletes optimize their performance and coaches make better strategic decisions.</p><p>The intersection of technology and sports promises even more exciting developments in the future.</p>',
    link: 'sports-technology-innovation',
    seccion: 'news',
    date: 'April 4, 2025',
  },
]

export function getNewsBySection(seccion: string): NewsItem[] {
  return mockNews.filter((item) => item.seccion === seccion)
}

export function getNewsByLink(seccion: string, link: string): NewsItem | undefined {
  return mockNews.find((item) => item.seccion === seccion && item.link === link)
}

export function getFeaturedNews(): NewsItem[] {
  return mockNews.slice(0, 3)
}

export function getTrendingNews(): NewsItem[] {
  return mockNews.slice(3, 7)
}
