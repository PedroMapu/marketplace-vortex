type ElementoCentralizavel = Pick<HTMLElement, "scrollIntoView">;

export function centralizarElementoSemFoco(
  elemento: ElementoCentralizavel,
  reduzirMovimento: boolean,
): void {
  elemento.scrollIntoView({
    behavior: reduzirMovimento ? "auto" : "smooth",
    block: "center",
    inline: "nearest",
  });
}
