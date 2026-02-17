-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active social links" 
ON social_links FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage social links" 
ON social_links FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Note: Make sure to insert some default links if needed
-- INSERT INTO social_links (platform, url, icon) VALUES 
-- ('Facebook', 'https://facebook.com', 'facebook'),
-- ('Instagram', 'https://instagram.com', 'instagram'),
-- ('Twitter', 'https://twitter.com', 'twitter');
