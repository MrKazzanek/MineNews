---
title: Minecraft 1.22 nigdy nie powstanie? Mojang zmienia system numeracji wersji
author: MrKazanek
date: 2025-12-29
image: https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/screenshots/net_default1_1170x500.jpg
avatar: https://qozaworks.netlify.app/assets/kazanek.png
categories: [Duże zmiany]
---

Deweloper David Carlton, znany graczom pod pseudonimem *Cornerhard*, podczas jednego z live’ów na swoim kanale podzielił się informacjami na temat przyszłości gry.

> W każdym razie utknęliśmy na numeracji 1.21, ponieważ próbowaliśmy wymyślić dobry i spójny sposób oznaczania nowych wersji gry. Od dłuższego czasu pozostajemy przy numerze 1.21, a najnowsza wersja pobiła pewien rekord — tak wysokiego numeru jak 1.21.11 nie mieliśmy jeszcze w żadnej wersji Minecrafta.  
> Wiemy, że chcecie, aby edycje Java i Bedrock miały podobną numerację, a także zdajemy sobie sprawę, że społeczność oczekuje uproszczenia systemu wersjonowania. Dlatego bądźcie na bieżąco — wkrótce opublikujemy oficjalny post na stronie [<u>minecraft.net</u>](https://www.minecraft.net/), w którym wyjaśnimy nowy system numeracji wersji.  
> Wiem, że wiele osób czekało na wersję 1.22, jednak taki numer mógłby wprowadzić graczy w błąd, sugerując ogromną aktualizację na miarę {c:#f37c1b}Tricky Trials{/c}. Tymczasem obecnie funkcjonujemy w nowym modelu aktualizacji opartym na Dropach.  
> <br> *Jest to zfrazowana wypowiedź tego Developera*


### Po tej wypowiedzi dowiedzieliśmy się, że:
- Zmieni się system numeracji wersji
- Numeracja ma być prostsza i bardziej czytelna dla graczy
- Numeracja ma w miarę możliwości ujednolicać edycje Java i Bedrock
- Wersja 1.22 **nigdy** nie wyjdzie
- Twórcy skupiają się obecnie na systemie aktualizacji nazywanym Dropami

---
## Nowy system numeracji. Jak działa i jak wygląda?

Mojang ***2 grudnia 2025*** roku opublikował na oficjalnej stronie [<u>artykuł</u>](https://www.minecraft.net/article/minecraft-new-version-numbering-system), w którym szczegółowo wyjaśnił, jak będzie działać nowy system numeracji wersji.

Z artykułu dowiadujemy się, że jest to koniec starej numeracji w stylu 1.16, 1.18, 1.21, 1.21.9 itd. Nowy system ma oficjalnie wejść w życie od nowego roku (2026), jednak pierwsze zmiany mogliśmy zobaczyć już wcześniej — ***16 grudnia 2025*** został wydany snapshot wykorzystujący nową numerację.

Zmiana ta jest podyktowana problemami społeczności z rozróżnianiem wersji zawierających nową zawartość w ramach Dropów od wydań stricte poprawkowych. Celem jest również ułatwienie pracy nie tylko zwykłym graczom, ale także twórcom modów, datapacków i innych dodatków. Dodatkowym problemem była rozbieżność numeracji pomiędzy edycjami Java i Bedrock — przykładowo drop {c:#ffe014}**The Garden Awakens**{/c} w edycji Java posiada numer 1.21.4, natomiast w edycji Bedrock oznaczony jest jako 1.21.50.

**Jak więc będzie wyglądać nowa numeracja? Już wyjaśniamy.**

Od 2026 roku numeracja będzie opierać się na roku wydania oraz numerze Dropu w danym roku. Dla przykładu, jeśli w 2026 roku pojawią się cztery Dropy, ich numeracja będzie wyglądać następująco:

- Pierwszy Drop w 2026 roku: `26.1`
- Drugi Drop: `26.2`
- Trzeci Drop: `26.3`
- Czwarty Drop: `26.4`

Pierwsze dwie cyfry (26) oznaczają dwie ostatnie cyfry roku, natomiast liczba po kropce to numer Dropu w danym roku.

Na pierwszy rzut oka system wydaje się prosty, jednak w praktyce wygląda to nieco inaczej. O ile numer przed kropką (rok) będzie wspólny dla edycji Java i Bedrock, o tyle numer po kropce może się różnić. Wynika to z faktu, że edycja Bedrock otrzymuje aktualizacje częściej niż Java, co zostało wyjaśnione w artykule przez twórców. Dodatkowo obie platformy posiadają własne ograniczenia techniczne. Mimo tej rozbieżności nowy system i tak jest znacznie bardziej czytelny niż poprzedni.

Warto podkreślić, że numeracja dotychczasowych aktualizacji oraz Dropów, które już się ukazały (wliczając w to drop {c:#3498db}Mounts of Mayhem{/c}), nie ulegnie zmianie. Dla lepszego zobrazowania działania nowego systemu twórcy przygotowali specjalną tabelę przedstawiającą, jak wyglądałaby numeracja w 2025 roku, gdyby obowiązywał już nowy system.

![Przykładowa numeracja dla roku 2025](https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/screenshots/Version_Numbering_Example.jpg)

Na tabeli wyraźnie widać, w jaki sposób numeracja będzie działać dla obu edycji Minecrafta. W przypadku Javy numer po kropce dla Dropów będzie zwiększany kolejno, natomiast Bedrock — który otrzymuje aktualizacje częściej — będzie używał numerów rosnących co 10. Może się również zdarzyć sytuacja, w której pełne wydanie trafi wyłącznie na Bedrocka — wówczas ta edycja otrzyma po prostu wyższy numer wersji.

Poniżej przykładowa tabela ilustrująca numerację Dropów dla obu edycji w 2026 roku:

| Java | Bedrock | Przykładowa nazwa Dropu |
|---|---|---|
| 26.1 | 26.10 | Combat Drop |
| 26.2 | 26.20 | Redstone Drop |
| 26.3 | 26.30 | Combat Drop |
|     | 26.40 | Wydanie poprawkowe do edycji Bedrock |
| 26.4 | 26.50 | Adventure Drop |

Dodatkowo edycja Java otrzyma czytelniejszy system numeracji wersji poprawkowych. Zamiast numerów w stylu 26.11, jak w Bedrocku, Java będzie korzystać z kolejnej kropki, np. `26.1.1`.

## A co z snapshotami?

Numeracja snapshotów w edycji Java również uległa zmianie. Dotychczasowy system oparty na roku i numerze tygodnia (np. 25w45a, gdzie 25 oznaczało rok 2025, w45 — 45. tydzień roku, a litera wskazywała kolejną poprawkę) został zastąpiony nowym schematem.

Obecnie numeracja wersji testowych wygląda następująco:

`Wersja Dropu-SNAPSHOT-Numer Snapshota`

Przykładowo, czwarty snapshot dla Dropu 26.1 będzie oznaczony jako:

`26.1-SNAPSHOT-4`

Ten sam schemat obowiązuje również dla wersji Pre-Release oraz Release Candidate:

- Pre-Release: `26.1-PRE-1`
- Release Candidate: `26.1-RC-1`

## Co zmieni dla nas ten system numeracji?

Dla zwykłych graczy Minecrafta w praktyce niewiele się zmieni. Największą różnicę odczują twórcy modów, datapacków oraz innych dodatków, którzy od teraz znacznie łatwiej będą mogli rozróżnić wersje zawierające nową zawartość od wydań czysto poprawkowych.

## Polecane materiały do obejrzenia:

Zmianę bardzo dobrze omówił [<u>Jurajski Staś</u>](https://www.youtube.com/@JurajskiStas) na swoim kanale YouTube.
<div class="video-wrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/N7nlaW1kzxQ?si=p_d1oo-S90hM5aXe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
#### Źródła:
- [<u>minecraft.net</u>](https://www.minecraft.net/)
- [<u>minecraft wiki</u>](https://minecraft.wiki/)
