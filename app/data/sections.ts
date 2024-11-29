interface Section {
  name: string;
  content: string;
}

export const sections: Section[] = [
  {
    name: "Résumé du profil",
    content: `
      <div class="w-full text-gray-700 leading-relaxed">
        <p class="text-sm italic">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque varius nisl sed urna tempor sollicitudin. Proin volutpat tincidunt sapien dignissim varius. Nunc blandit elit lectus, sed porttitor enim lacinia ac. Aenean facilisis a ante vel aliquet. Proin accumsan maximus justo, quis ultricies nisl viverra et. Quisque feugiat massa sit amet euismod elementum. Ut ex tortor, auctor quis ex nec, lobortis pellentesque orci. Integer risus augue, mattis quis turpis in, vehicula ullamcorper turpis. Pellentesque tincidunt ultricies tristique. Maecenas hendrerit elementum ullamcorper. Nulla facilisi. Nulla fermentum a risus in ultrices. Curabitur ultricies bibendum ligula, eu tincidunt massa sodales id. Pellentesque fringilla nulla nec lacus sagittis, sit amet placerat eros sollicitudin.
        </p>
      </div>
    `
  },
  {
    name: "Expériences professionnelles",
    content: `
      <div class="w-full">
        <h2 class="text-primary uppercase text-[18px] font-bold">
          EXPÉRIENCES PROFESSIONNELLES
        </h2>
        <div class="w-[30%] h-[4px] bg-primary rounded-full mb-1"></div>
        <div class="mb-2">
          <h3 class="text-primary text-[16px] font-bold">De janvier 2024 à février 2024</h3>
          <p class="text-black font-normal text-[14px]">Développeur Full Stack | Entreprise XYZ France</h3>
          <p class="italic text-[13px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="mb-2">
          <h3 class="text-primary text-[16px] font-bold">De janvier 2024 à février 2024</h3>
          <p class="text-black font-normal text-[14px]">Développeur Full Stack | Entreprise XYZ France</h3>
          <p class="italic text-[13px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div>
          <h3 class="text-primary text-[16px] font-bold">De janvier 2024 à février 2024</h3>
          <p class="text-black font-normal text-[14px]">Développeur Full Stack | Entreprise XYZ France</h3>
          <p class="italic text-[13px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    `
  },
  {
    name: "Parcours scolaire",
    content: `
      <div class="w-full">
        <h2 class="text-primary uppercase text-[18px] font-bold">
          PARCOURS SCOLAIRE
        </h2>
        <div class="w-[30%] h-[4px] bg-primary rounded-full mb-1"></div>
        <div class="mb-2">
          <h3 class="text-primary text-[16px] font-bold">De 2018 à 2020</h3>
          <p class="text-black font-normal text-[14px]">Master en Informatique | Université XYZ</p>
          <p class="italic text-[13px]">Spécialisation en développement web et mobile</p>
        </div>
        <div>
          <h3 class="text-primary text-[16px] font-bold">De 2016 à 2018</h3>
          <p class="text-black font-normal text-[14px]">Licence en Informatique | Université XYZ</p>
          <p class="italic text-[13px]">Formation générale en informatique et programmation</p>
        </div>
      </div>
    `
  },
  {
    name: "Compétences techniques ou personnelles",
    content: `
      <div class="w-full">
        <div>
          <h3 class="text-primary text-[16px] font-bold">Compétences techniques</h3>
          <ul class="text-[14px]">
            <li><strong>Langages:</strong> JavaScript, TypeScript, Python</li>
            <li><strong>Frameworks:</strong> React, Vue.js, Node.js</li>
            <li><strong>Outils:</strong> Git, Docker, AWS</li>
          </ul>
        </div>
        <div>
          <h3 class="text-primary text-[16px] font-bold">Compétences personnelles</h3>
          <ul class="text-[14px]">
            <li>Travail d'équipe</li>
            <li>Communication</li>
            <li>Résolution de problèmes</li>
          </ul>
        </div>
      </div>
    `
  }
];
