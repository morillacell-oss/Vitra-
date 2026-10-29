import { nicheCatalog } from './vitra-data';

const img=(id:string,w=1800)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=88`;

// Keep demo media resilient: the previous tattoo hero asset no longer renders reliably.
// These fallbacks are all tattoo-specific and are shared by catalog cards and generated previews.
nicheCatalog.tattoo.hero=img('photo-1565058379802-bbe93b2f703a');
nicheCatalog.tattoo.about=img('photo-1611501275019-9b5cda994e8d',1400);
nicheCatalog.tattoo.gallery=[
  img('photo-1565058379802-bbe93b2f703a',1200),
  img('photo-1611501275019-9b5cda994e8d',1200),
  img('photo-1612459284970-e8f027596582',1200),
  img('photo-1598371839696-5c5bb00bdc28',1200)
];
