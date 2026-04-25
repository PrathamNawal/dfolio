insert into storage.buckets (id, name, public) values ('portfolio-images', 'portfolio-images', true);

create policy "owner_upload" on storage.objects for insert with check (
  bucket_id = 'portfolio-images' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "public_read" on storage.objects for select using (bucket_id = 'portfolio-images');
create policy "owner_delete" on storage.objects for delete using (
  bucket_id = 'portfolio-images' and auth.uid()::text = (storage.foldername(name))[1]
);
