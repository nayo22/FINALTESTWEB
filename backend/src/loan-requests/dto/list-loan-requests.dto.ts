import { Type } from "class-transformer";
import { IsIn, IsOptional } from "class-validator"
export class ListLoanRequestsDto {
  // TODO BACK-A: agregar las validaciones del filtro opcional indicado en el enunciado.
@IsOptional()
@IsIn(["pending", "loaned"])
  // La conversión de la consulta a número ya está preparada.
  @Type(() => Number)
  toolId?: number;
}

