import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SAL_CSS, SAL_HTML } from "@/lib/sal-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAL Personal Training | Estúdio Privado de Treino em Espinho" },
      {
        name: "description",
        content:
          "Estúdio de Personal Training privado em Espinho. Sem filas, sem multidões, sem esperar por equipamento — só tu e o teu treinador.",
      },
      { property: "og:title", content: "SAL Personal Training | Estúdio Privado em Espinho" },
      {
        property: "og:description",
        content: "Treino personalizado sem filas nem multidões. Acompanhamento exclusivo, sessão a sessão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      { rel: "canonical", href: "https://www.salpersonaltraining.pt/" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    const header = document.getElementById("siteHeader");
    const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();

    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");
    const toggle = () => {
      navToggle?.classList.toggle("open");
      mainNav?.classList.toggle("open");
    };
    navToggle?.addEventListener("click", toggle);
    const closeNav = () => {
      navToggle?.classList.remove("open");
      mainNav?.classList.remove("open");
    };
    mainNav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const row = document.querySelector(`#hoursTable tr[data-day="${new Date().getDay()}"]`);
    row?.classList.add("today");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
    const safety = window.setTimeout(() => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => el.classList.add("visible"));
    }, 2500);

    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector<HTMLElement>(".faq-a");
      q?.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach((open) => {
          open.classList.remove("open");
          const oa = open.querySelector<HTMLElement>(".faq-a");
          if (oa) oa.style.maxHeight = "";
        });
        if (!isOpen && a) {
          item.classList.add("open");
          a.style.maxHeight = `${a.scrollHeight}px`;
        }
      });
    });

    const field = document.getElementById("dotfield");
    const caption = document.getElementById("dotCaption");
    let fieldObserver: IntersectionObserver | undefined;
    if (field && field.childElementCount === 0) {
      const keepIndexes = [24, 25];
      for (let i = 0; i < 49; i++) {
        const d = document.createElement("div");
        d.className = "dot";
        if (keepIndexes.includes(i)) d.classList.add("keep");
        d.style.transitionDelay = `${Math.random() * 0.4}s`;
        field.appendChild(d);
      }
      fieldObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              window.setTimeout(() => {
                field.classList.add("cleared");
                if (caption) {
                  caption.innerHTML = "<span><b>SÓ TU</b> E O TEU PT</span>";
                  caption.classList.add("show");
                }
              }, 900);
              fieldObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
      );
      fieldObserver.observe(field);
    }

    const form = document.getElementById("contactForm") as HTMLFormElement | null;
    const note = document.getElementById("formNote");
    const onSubmit = (e: Event) => {
      e.preventDefault();
      if (!form) return;
      const nome = (form.elements.namedItem("nome") as HTMLInputElement).value.trim();
      const contacto = (form.elements.namedItem("contacto") as HTMLInputElement).value.trim();
      const mensagem = (form.elements.namedItem("mensagem") as HTMLTextAreaElement).value.trim();
      if (!nome || !contacto) {
        if (note) note.textContent = "Preenche o nome e o contacto.";
        return;
      }
      const texto = `Olá, sou ${nome} (${contacto}).${mensagem ? ` ${mensagem}` : ""}`;
      window.open(`https://wa.me/351935261830?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
      if (note) note.textContent = "A abrir o WhatsApp com a tua mensagem...";
      form.reset();
    };
    form?.addEventListener("submit", onSubmit);

    return () => {
      window.removeEventListener("scroll", onScroll);
      navToggle?.removeEventListener("click", toggle);
      form?.removeEventListener("submit", onSubmit);
      revealObserver.disconnect();
      fieldObserver?.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SAL_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: SAL_HTML }} />
    </>
  );
}
