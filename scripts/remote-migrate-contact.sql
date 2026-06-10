-- 1. Insert "Contact Us" page into special_pages
INSERT INTO `special_pages` (
  `admin_title`,
  `slug`,
  `en_title`,
  `en_content`,
  `lv_title`,
  `lv_content`,
  `_status`
) VALUES (
  'Contact Us',
  'contact',
  'Contact Us',
  'We would love to hear from you! Whether you are a Latvian newly arrived in the Northern Territory, a descendant wishing to reconnect with your heritage, or a local resident interested in Latvian culture, our door is always open.

You can reach out to us via email for general inquiries, membership applications, or event details. We also encourage you to follow our social media channels to stay updated on upcoming community gatherings and initiatives.

Let''s connect and build a stronger community together in the Top End!

Email: hello@darwinlatvians.org',
  'Kontakti',
  'Mēs priecāsimies par jūsu ziņām! Neatkarīgi no tā, vai esat latvietis, kurš nesen ieradies Ziemeļu Teritorijā, pēcnācējs, kurš vēlas atjaunot saikni ar savu mantojumu, vai vietējais iedzīvotājs, kuram interesē latviešu kultūra – mūsu durvis ir atvērtas.

Sazinieties ar mums pa e-pastu, lai uzdotu jautājumus, pieteiktos dalībai apvienībā vai uzzinātu par pasākumiem. Tāpat aicinām sekot mūsu sociālo tīklu profiliem, lai uzzinātu jaunumus par nākamiem kopienas sarīkojumiem un iniciatīvām.

Sazināsimies un veidosim stiprāku kopienu kopā Ziemeļu Teritorijā!

E-pasts: hello@darwinlatvians.org',
  'published'
);

-- 2. Delete old standard Contact page and its blocks from pages table to avoid routing conflicts
DELETE FROM `pages_blocks_hero` WHERE `_parent_id` IN (SELECT `id` FROM `pages` WHERE `slug` = 'contact');
DELETE FROM `pages_blocks_content` WHERE `_parent_id` IN (SELECT `id` FROM `pages` WHERE `slug` = 'contact');
DELETE FROM `pages_blocks_cta` WHERE `_parent_id` IN (SELECT `id` FROM `pages` WHERE `slug` = 'contact');
DELETE FROM `pages` WHERE `slug` = 'contact';

-- 3. Mark migration as applied in payload_migrations
INSERT INTO `payload_migrations` (name, batch, created_at, updated_at) VALUES ('20260610_113750_move_contact_to_special_pages', 7, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
