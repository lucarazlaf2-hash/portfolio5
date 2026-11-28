/**
 * src/data/videos.ts
 * Central video configuration for external hosting (Vercel Blob / Cloudflare R2 / AWS S3).
 *
 * To point to your hosted videos, set the VITE_VIDEO_BASE_URL environment variable:
 * e.g. VITE_VIDEO_BASE_URL="https://pub-xxxxxxxx.r2.dev"
 * or edit VIDEO_BASE_URL below.
 */

export const VIDEO_BASE_URL =
  (import.meta.env.VITE_VIDEO_BASE_URL as string)?.replace(/\/+$/, "") ||
  "https://DEINE-BLOB-ODER-R2-URL";

export function buildVideoUrl(filename: string): string {
  if (filename.startsWith("http://") || filename.startsWith("https://")) return filename;
  const base = VIDEO_BASE_URL.replace(/\/+$/, "");
  return `${base}/${encodeURIComponent(filename)}`;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  filename: string;
  originalFilename: string;
  videoUrl: string;
  posterUrl?: string | null;
  isHero?: boolean;
  width?: number | null;
  height?: number | null;
  aspect?: number | null;
}

export const VIDEOS: VideoItem[] = [
  {
    "id": "hero-1",
    "title": "Hero 1",
    "category": "Hero",
    "filename": "hero-1.mp4",
    "originalFilename": "hero-1.mp4",
    "isHero": true,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "hero-2",
    "title": "Hero 2",
    "category": "Hero",
    "filename": "hero-2.mp4",
    "originalFilename": "hero-2.mp4",
    "isHero": true,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "hero-3",
    "title": "Hero 3",
    "category": "Hero",
    "filename": "hero-3.mp4",
    "originalFilename": "hero-3.mp4",
    "isHero": true,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-best-performing-7b4cc9ed06054be69f6c43311eaf3a83",
    "title": "7b4cc9ed06054be69f6c43311eaf3a83",
    "category": "Best Performing",
    "filename": "7b4cc9ed06054be69f6c43311eaf3a83.mp4",
    "originalFilename": "7b4cc9ed06054be69f6c43311eaf3a83.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-best-performing-7de75495f44c462f80a50ec64d0735ca",
    "title": "7de75495f44c462f80a50ec64d0735ca",
    "category": "Best Performing",
    "filename": "7de75495f44c462f80a50ec64d0735ca.mp4",
    "originalFilename": "7de75495f44c462f80a50ec64d0735ca.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-best-performing-1227-1-kopie",
    "title": "(1) Kopie",
    "category": "Best Performing",
    "filename": "1227 (1)-Kopie.mp4",
    "originalFilename": "1227 (1)-Kopie.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-best-performing-copy-423f91a8-2267-4e5d-b916-99a4b7c26ebe",
    "title": "Copy 423F91A8 2267 4E5D B916 99A4B7C26EBE",
    "category": "Best Performing",
    "filename": "copy_423F91A8-2267-4E5D-B916-99A4B7C26EBE.mp4",
    "originalFilename": "copy_423F91A8-2267-4E5D-B916-99A4B7C26EBE.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-best-performing-copy-347490cd-460b-487a-8dc5-f1a464ecf725",
    "title": "Copy 347490CD 460B 487A 8DC5 F1A464ECF725",
    "category": "Best Performing",
    "filename": "copy_347490CD-460B-487A-8DC5-F1A464ECF725.mp4",
    "originalFilename": "copy_347490CD-460B-487A-8DC5-F1A464ECF725.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-best-performing-copy-c5ba292c-1f1b-4f50-9890-034e54206229",
    "title": "Copy C5BA292C 1F1B 4F50 9890 034E54206229",
    "category": "Best Performing",
    "filename": "copy_C5BA292C-1F1B-4F50-9890-034E54206229.mp4",
    "originalFilename": "copy_C5BA292C-1F1B-4F50-9890-034E54206229.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-0221",
    "title": "0221",
    "category": "Edits",
    "filename": "0221.mp4",
    "originalFilename": "0221.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-0228",
    "title": "0228",
    "category": "Edits",
    "filename": "0228.mp4",
    "originalFilename": "0228.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-0307-5",
    "title": "(5)",
    "category": "Edits",
    "filename": "0307 (5).mp4",
    "originalFilename": "0307 (5).mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-0403",
    "title": "0403",
    "category": "Edits",
    "filename": "0403.mp4",
    "originalFilename": "0403.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-0404-2",
    "title": "(2)",
    "category": "Edits",
    "filename": "0404 (2).mp4",
    "originalFilename": "0404 (2).mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-0404-3",
    "title": "(3)",
    "category": "Edits",
    "filename": "0404 (3).mp4",
    "originalFilename": "0404 (3).mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-0418-1",
    "title": "(1)",
    "category": "Edits",
    "filename": "0418 (1).mp4",
    "originalFilename": "0418 (1).mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-0509-4",
    "title": "(4)",
    "category": "Edits",
    "filename": "0509 (4).mp4",
    "originalFilename": "0509 (4).mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-aura",
    "title": "Aura",
    "category": "Edits",
    "filename": "aura.mp4",
    "originalFilename": "aura.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-brez-vidd",
    "title": "Brez Vidd",
    "category": "Edits",
    "filename": "brez vidd.mp4",
    "originalFilename": "brez vidd.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-1d4f6236-eb34-49bc-a8ac-76117b0bfc2f",
    "title": "Copy 1D4F6236 EB34 49BC A8AC 76117B0BFC2F",
    "category": "Edits",
    "filename": "copy_1D4F6236-EB34-49BC-A8AC-76117B0BFC2F.mp4",
    "originalFilename": "copy_1D4F6236-EB34-49BC-A8AC-76117B0BFC2F.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-3b18f3cb-f267-4187-b855-54bf96d1faf4",
    "title": "Copy 3B18F3CB F267 4187 B855 54BF96D1FAF4",
    "category": "Edits",
    "filename": "copy_3B18F3CB-F267-4187-B855-54BF96D1FAF4.mp4",
    "originalFilename": "copy_3B18F3CB-F267-4187-B855-54BF96D1FAF4.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-6de08115-af7c-411b-8165-cb72d3b495ce",
    "title": "Copy 6DE08115 AF7C 411B 8165 CB72D3B495CE",
    "category": "Edits",
    "filename": "copy_6DE08115-AF7C-411B-8165-CB72D3B495CE.mp4",
    "originalFilename": "copy_6DE08115-AF7C-411B-8165-CB72D3B495CE.MOV",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-26b51b0f-f2da-476a-b096-96937f1a8ff6",
    "title": "Copy 26B51B0F F2DA 476A B096 96937F1A8FF6",
    "category": "Edits",
    "filename": "copy_26B51B0F-F2DA-476A-B096-96937F1A8FF6.mp4",
    "originalFilename": "copy_26B51B0F-F2DA-476A-B096-96937F1A8FF6.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-61e075d4-4b1b-4dc0-8135-063fe1045d43",
    "title": "Copy 61E075D4 4B1B 4DC0 8135 063FE1045D43",
    "category": "Edits",
    "filename": "copy_61E075D4-4B1B-4DC0-8135-063FE1045D43.mp4",
    "originalFilename": "copy_61E075D4-4B1B-4DC0-8135-063FE1045D43.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-80a3cae5-7688-4bfd-8119-162b963cca54",
    "title": "Copy 80A3CAE5 7688 4BFD 8119 162B963CCA54",
    "category": "Edits",
    "filename": "copy_80A3CAE5-7688-4BFD-8119-162B963CCA54.mp4",
    "originalFilename": "copy_80A3CAE5-7688-4BFD-8119-162B963CCA54.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-95dd42fe-3423-45a1-bf1e-0fdef6cec2b7",
    "title": "Copy 95DD42FE 3423 45A1 BF1E 0FDEF6CEC2B7",
    "category": "Edits",
    "filename": "copy_95DD42FE-3423-45A1-BF1E-0FDEF6CEC2B7.mp4",
    "originalFilename": "copy_95DD42FE-3423-45A1-BF1E-0FDEF6CEC2B7.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-6228a6b0-0c30-4a26-9384-19253ed2d1ef",
    "title": "Copy 6228A6B0 0C30 4A26 9384 19253ED2D1EF",
    "category": "Edits",
    "filename": "copy_6228A6B0-0C30-4A26-9384-19253ED2D1EF.mp4",
    "originalFilename": "copy_6228A6B0-0C30-4A26-9384-19253ED2D1EF.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-7994d377-c770-4230-83a9-2d376b4a378c",
    "title": "Copy 7994D377 C770 4230 83A9 2D376B4A378C",
    "category": "Edits",
    "filename": "copy_7994D377-C770-4230-83A9-2D376B4A378C.mp4",
    "originalFilename": "copy_7994D377-C770-4230-83A9-2D376B4A378C.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-38952af2-cabe-4b56-ac3b-86db9bf82b30",
    "title": "Copy 38952AF2 CABE 4B56 AC3B 86DB9BF82B30",
    "category": "Edits",
    "filename": "copy_38952AF2-CABE-4B56-AC3B-86DB9BF82B30.mp4",
    "originalFilename": "copy_38952AF2-CABE-4B56-AC3B-86DB9BF82B30.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-153382cc-d2da-4ec8-92f6-75482de8194f",
    "title": "Copy 153382CC D2DA 4EC8 92F6 75482DE8194F",
    "category": "Edits",
    "filename": "copy_153382CC-D2DA-4EC8-92F6-75482DE8194F.mp4",
    "originalFilename": "copy_153382CC-D2DA-4EC8-92F6-75482DE8194F.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-82391913-8147-4d7e-9b1b-e37471872b0e",
    "title": "Copy 82391913 8147 4D7E 9B1B E37471872B0E",
    "category": "Edits",
    "filename": "copy_82391913-8147-4D7E-9B1B-E37471872B0E.mp4",
    "originalFilename": "copy_82391913-8147-4D7E-9B1B-E37471872B0E.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-a55a51c4-54aa-473d-9ca5-ea0124a742b1",
    "title": "Copy A55A51C4 54AA 473D 9CA5 EA0124A742B1",
    "category": "Edits",
    "filename": "copy_A55A51C4-54AA-473D-9CA5-EA0124A742B1.mp4",
    "originalFilename": "copy_A55A51C4-54AA-473D-9CA5-EA0124A742B1.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-c654532b-9e49-4894-a7e0-d97049d14173",
    "title": "Copy C654532B 9E49 4894 A7E0 D97049D14173",
    "category": "Edits",
    "filename": "copy_C654532B-9E49-4894-A7E0-D97049D14173.mp4",
    "originalFilename": "copy_C654532B-9E49-4894-A7E0-D97049D14173.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-cb2d4f9c-7f1c-4445-bddc-4e954ec62f55",
    "title": "Copy CB2D4F9C 7F1C 4445 BDDC 4E954EC62F55",
    "category": "Edits",
    "filename": "copy_CB2D4F9C-7F1C-4445-BDDC-4E954EC62F55.mp4",
    "originalFilename": "copy_CB2D4F9C-7F1C-4445-BDDC-4E954EC62F55.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-ce168019-5a38-454c-9936-30a805fc92aa",
    "title": "Copy CE168019 5A38 454C 9936 30A805FC92AA",
    "category": "Edits",
    "filename": "copy_CE168019-5A38-454C-9936-30A805FC92AA.mp4",
    "originalFilename": "copy_CE168019-5A38-454C-9936-30A805FC92AA.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-e9d5b145-6c64-40ac-9e9a-f9d8ef2c8983",
    "title": "Copy E9D5B145 6C64 40AC 9E9A F9D8EF2C8983",
    "category": "Edits",
    "filename": "copy_E9D5B145-6C64-40AC-9E9A-F9D8EF2C8983.mp4",
    "originalFilename": "copy_E9D5B145-6C64-40AC-9E9A-F9D8EF2C8983.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-f1e5d5d4-03c4-4d80-8f50-7ba7e6182326",
    "title": "Copy F1E5D5D4 03C4 4D80 8F50 7BA7E6182326",
    "category": "Edits",
    "filename": "copy_F1E5D5D4-03C4-4D80-8F50-7BA7E6182326.mp4",
    "originalFilename": "copy_F1E5D5D4-03C4-4D80-8F50-7BA7E6182326.MOV",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-copy-f412d88c-29c6-4ab7-bc63-3a2478044a8a",
    "title": "Copy F412D88C 29C6 4AB7 BC63 3A2478044A8A",
    "category": "Edits",
    "filename": "copy_F412D88C-29C6-4AB7-BC63-3A2478044A8A.mp4",
    "originalFilename": "copy_F412D88C-29C6-4AB7-BC63-3A2478044A8A.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-culinannn",
    "title": "Culinannn",
    "category": "Edits",
    "filename": "culinannn.mp4",
    "originalFilename": "culinannn.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-edit-brez",
    "title": "Edit Brez",
    "category": "Edits",
    "filename": "edit brez.mp4",
    "originalFilename": "edit brez.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-edit-for-brez",
    "title": "Edit For Brez",
    "category": "Edits",
    "filename": "edit for brez.mp4",
    "originalFilename": "edit for brez.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-edit2",
    "title": "Edit2",
    "category": "Edits",
    "filename": "edit2.mp4",
    "originalFilename": "edit2.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-finale-cullinan-edit",
    "title": "Finale Cullinan Edit",
    "category": "Edits",
    "filename": "Finale Cullinan edit.mp4",
    "originalFilename": "Finale Cullinan edit.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-edits-the-drop",
    "title": "The Drop",
    "category": "Edits",
    "filename": "the drop.mp4",
    "originalFilename": "the drop.mp4",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-other-copy-06b7bccf-3b3c-4b94-8ad7-265dd6e7cead",
    "title": "Copy 06B7BCCF 3B3C 4B94 8AD7 265DD6E7CEAD",
    "category": "Other",
    "filename": "copy_06B7BCCF-3B3C-4B94-8AD7-265DD6E7CEAD.mp4",
    "originalFilename": "copy_06B7BCCF-3B3C-4B94-8AD7-265DD6E7CEAD.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-other-copy-3249beda-f55e-4d15-b0f2-ce11cd88d99b",
    "title": "Copy 3249BEDA F55E 4D15 B0F2 CE11CD88D99B",
    "category": "Other",
    "filename": "copy_3249BEDA-F55E-4D15-B0F2-CE11CD88D99B.mp4",
    "originalFilename": "copy_3249BEDA-F55E-4D15-B0F2-CE11CD88D99B.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-other-copy-c5472e66-ff62-42a9-9121-e7e682577763",
    "title": "Copy C5472E66 FF62 42A9 9121 E7E682577763",
    "category": "Other",
    "filename": "copy_C5472E66-FF62-42A9-9121-E7E682577763.mp4",
    "originalFilename": "copy_C5472E66-FF62-42A9-9121-E7E682577763.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-other-copy-f96dfa6d-e26b-46d0-95b1-2870cf527ad8",
    "title": "Copy F96DFA6D E26B 46D0 95B1 2870CF527AD8",
    "category": "Other",
    "filename": "copy_F96DFA6D-E26B-46D0-95B1-2870CF527AD8.mp4",
    "originalFilename": "copy_F96DFA6D-E26B-46D0-95B1-2870CF527AD8.MOV",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-1ce14bbb97c846ffaf5544ef9735440c",
    "title": "1ce14bbb97c846ffaf5544ef9735440c",
    "category": "Talking Head",
    "filename": "1ce14bbb97c846ffaf5544ef9735440c.mp4",
    "originalFilename": "1ce14bbb97c846ffaf5544ef9735440c.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-5e9c95028e574fbba61b20ff6632dde5",
    "title": "5e9c95028e574fbba61b20ff6632dde5",
    "category": "Talking Head",
    "filename": "5e9c95028e574fbba61b20ff6632dde5.mp4",
    "originalFilename": "5e9c95028e574fbba61b20ff6632dde5.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-8bc2e09e7e464681a784169f459d5bb0",
    "title": "8bc2e09e7e464681a784169f459d5bb0",
    "category": "Talking Head",
    "filename": "8bc2e09e7e464681a784169f459d5bb0.mp4",
    "originalFilename": "8bc2e09e7e464681a784169f459d5bb0.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-75ec86d02cb14ca4a05e89e2a72254ad",
    "title": "75ec86d02cb14ca4a05e89e2a72254ad",
    "category": "Talking Head",
    "filename": "75ec86d02cb14ca4a05e89e2a72254ad.mp4",
    "originalFilename": "75ec86d02cb14ca4a05e89e2a72254ad.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-1203",
    "title": "1203",
    "category": "Talking Head",
    "filename": "1203.mp4",
    "originalFilename": "1203.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-1227-3-kopie",
    "title": "(3) Kopie",
    "category": "Talking Head",
    "filename": "1227 (3)-Kopie.mp4",
    "originalFilename": "1227 (3)-Kopie.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-2146f5e369ed4853b841fe0734b9b1ce",
    "title": "2146f5e369ed4853b841fe0734b9b1ce",
    "category": "Talking Head",
    "filename": "2146f5e369ed4853b841fe0734b9b1ce.mp4",
    "originalFilename": "2146f5e369ed4853b841fe0734b9b1ce.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-093239e2f7ff41a296bc9228a9f76f93",
    "title": "093239e2f7ff41a296bc9228a9f76f93",
    "category": "Talking Head",
    "filename": "093239e2f7ff41a296bc9228a9f76f93.mp4",
    "originalFilename": "093239e2f7ff41a296bc9228a9f76f93.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-98139ddcdece4d13836a95492cf5e952",
    "title": "98139ddcdece4d13836a95492cf5e952",
    "category": "Talking Head",
    "filename": "98139ddcdece4d13836a95492cf5e952.mp4",
    "originalFilename": "98139ddcdece4d13836a95492cf5e952.MOV",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-3e50260c-af16-4a8a-a365-f2af6bd58d65",
    "title": "Copy 3E50260C AF16 4A8A A365 F2AF6BD58D65",
    "category": "Talking Head",
    "filename": "copy_3E50260C-AF16-4A8A-A365-F2AF6BD58D65.mp4",
    "originalFilename": "copy_3E50260C-AF16-4A8A-A365-F2AF6BD58D65.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-4bc79a6d-f28c-4413-8869-434bea03908f",
    "title": "Copy 4BC79A6D F28C 4413 8869 434BEA03908F",
    "category": "Talking Head",
    "filename": "copy_4BC79A6D-F28C-4413-8869-434BEA03908F.mp4",
    "originalFilename": "copy_4BC79A6D-F28C-4413-8869-434BEA03908F.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-38ce6fce-6a0d-4dbf-8497-fce135fd1dff",
    "title": "Copy 38CE6FCE 6A0D 4DBF 8497 FCE135FD1DFF",
    "category": "Talking Head",
    "filename": "copy_38CE6FCE-6A0D-4DBF-8497-FCE135FD1DFF.mp4",
    "originalFilename": "copy_38CE6FCE-6A0D-4DBF-8497-FCE135FD1DFF.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-98d38a92-41b1-49db-9161-2fa912ce9f60",
    "title": "Copy 98D38A92 41B1 49DB 9161 2FA912CE9F60",
    "category": "Talking Head",
    "filename": "copy_98D38A92-41B1-49DB-9161-2FA912CE9F60.mp4",
    "originalFilename": "copy_98D38A92-41B1-49DB-9161-2FA912CE9F60.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-311aa1c7-0a4e-431c-9446-9acffdecab4c",
    "title": "Copy 311AA1C7 0A4E 431C 9446 9ACFFDECAB4C",
    "category": "Talking Head",
    "filename": "copy_311AA1C7-0A4E-431C-9446-9ACFFDECAB4C.mp4",
    "originalFilename": "copy_311AA1C7-0A4E-431C-9446-9ACFFDECAB4C.MOV",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-3399fbb1-9d98-4d1f-9cf4-105acfd3ac87",
    "title": "Copy 3399FBB1 9D98 4D1F 9CF4 105ACFD3AC87",
    "category": "Talking Head",
    "filename": "copy_3399FBB1-9D98-4D1F-9CF4-105ACFD3AC87.mp4",
    "originalFilename": "copy_3399FBB1-9D98-4D1F-9CF4-105ACFD3AC87.MOV",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-5457e355-a62e-4e33-bf2c-13928680f2cc",
    "title": "Copy 5457E355 A62E 4E33 BF2C 13928680F2CC",
    "category": "Talking Head",
    "filename": "copy_5457E355-A62E-4E33-BF2C-13928680F2CC.mp4",
    "originalFilename": "copy_5457E355-A62E-4E33-BF2C-13928680F2CC.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-bece6d0c-12e9-4def-aadb-fa56ddac151e",
    "title": "Copy BECE6D0C 12E9 4DEF AADB FA56DDAC151E",
    "category": "Talking Head",
    "filename": "copy_BECE6D0C-12E9-4DEF-AADB-FA56DDAC151E.mp4",
    "originalFilename": "copy_BECE6D0C-12E9-4DEF-AADB-FA56DDAC151E.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-c1467bd3-07dc-42e7-b30c-a563aa54a601",
    "title": "Copy C1467BD3 07DC 42E7 B30C A563AA54A601",
    "category": "Talking Head",
    "filename": "copy_C1467BD3-07DC-42E7-B30C-A563AA54A601.mp4",
    "originalFilename": "copy_C1467BD3-07DC-42E7-B30C-A563AA54A601.MOV",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-d9c80a62-ebb5-4a83-8898-12ab3f0e56ed",
    "title": "Copy D9C80A62 EBB5 4A83 8898 12AB3F0E56ED",
    "category": "Talking Head",
    "filename": "copy_D9C80A62-EBB5-4A83-8898-12AB3F0E56ED.mp4",
    "originalFilename": "copy_D9C80A62-EBB5-4A83-8898-12AB3F0E56ED.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-d651bee7-20f3-46e2-9356-c1618f8191fe",
    "title": "Copy D651BEE7 20F3 46E2 9356 C1618F8191FE",
    "category": "Talking Head",
    "filename": "copy_D651BEE7-20F3-46E2-9356-C1618F8191FE.mp4",
    "originalFilename": "copy_D651BEE7-20F3-46E2-9356-C1618F8191FE.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-copy-e9c94241-d852-47c4-aaaf-404952afbc1e",
    "title": "Copy E9C94241 D852 47C4 AAAF 404952AFBC1E",
    "category": "Talking Head",
    "filename": "copy_E9C94241-D852-47C4-AAAF-404952AFBC1E.mp4",
    "originalFilename": "copy_E9C94241-D852-47C4-AAAF-404952AFBC1E.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-e4ea3c67a67b4e2fb85e5120a00fa06a",
    "title": "E4ea3c67a67b4e2fb85e5120a00fa06a",
    "category": "Talking Head",
    "filename": "e4ea3c67a67b4e2fb85e5120a00fa06a.mp4",
    "originalFilename": "e4ea3c67a67b4e2fb85e5120a00fa06a.MOV",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  },
  {
    "id": "portfolio-talking-head-screenrecording-07-18-2025-15-30-35-1",
    "title": "ScreenRecording 07 18 2025 15 30 35 1",
    "category": "Talking Head",
    "filename": "ScreenRecording_07-18-2025 15-30-35_1.mp4",
    "originalFilename": "ScreenRecording_07-18-2025 15-30-35_1.mov",
    "isHero": false,
    "width": null,
    "height": null,
    "aspect": null
  }
].map(v => ({
  ...v,
  videoUrl: buildVideoUrl(v.filename),
  posterUrl: null,
}));

export const HERO_VIDEOS = VIDEOS.filter(v => v.isHero);
export const PORTFOLIO_VIDEOS = VIDEOS.filter(v => !v.isHero);

export const CATEGORIES = [
  "Best Performing",
  "Edits",
  "Other",
  "Talking Head",
] as const;
