# Storage – Buckets do mycash+ (Supabase)

Os buckets foram criados no projeto **Creative** e estão disponíveis para upload de avatares, logos de cartões e anexos.

## Buckets

| Bucket         | Uso                          | Público | Políticas |
|----------------|------------------------------|--------|-----------|
| **avatars**    | Avatares de usuário e membros da família | Sim    | Autenticados podem inserir/atualizar/remover; leitura pública para exibir fotos. |
| **cards**      | Logos de bancos/cartões       | Sim    | Autenticados podem inserir/atualizar/remover; leitura pública. |
| **attachments**| Comprovantes, notas fiscais, vídeos | Não   | Apenas o dono (`owner_id = auth.uid()`) pode ler, atualizar e remover. |

## Onde criar pelo Dashboard (se precisar recriar)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard) → projeto **Creative**.
2. Menu **Storage**.
3. **New bucket** para cada um:
   - **avatars** – marque **Public bucket**.
   - **cards** – marque **Public bucket**.
   - **attachments** – deixe privado (não marque Public).

## Políticas aplicadas (RLS em `storage.objects`)

- **avatars** e **cards**: `INSERT` para `authenticated`; `SELECT` para `public`; `UPDATE`/`DELETE` apenas quando `owner_id = auth.uid()::text`.
- **attachments**: `INSERT` para `authenticated`; `SELECT`/`UPDATE`/`DELETE` apenas quando `owner_id = auth.uid()::text`.

O `owner_id` é preenchido automaticamente pelo Supabase com o id do usuário autenticado no upload.

## Uso no front (services)

- `src/services/storage.ts`: `uploadAvatar(userId, file)`, `uploadMemberAvatar(memberId, file)`, `uploadCardLogo(accountId, file)`.
- Caminhos sugeridos: `avatars/{userId}/...` ou `avatars/{memberId}/...`, `cards/{accountId}/...`, `attachments/{userId}/...`.
