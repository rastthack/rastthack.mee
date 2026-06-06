
ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND char_length(email) <= 255),
  ADD CONSTRAINT contact_messages_name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT contact_messages_message_len CHECK (char_length(message) BETWEEN 1 AND 5000);

DROP POLICY IF EXISTS "Anyone can insert messages" ON public.contact_messages;

CREATE POLICY "Anyone can insert valid messages"
  ON public.contact_messages
  FOR INSERT
  TO public
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(message) BETWEEN 1 AND 5000
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(email) <= 255
  );
