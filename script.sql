USE [blog]
GO
/****** Object:  Table [dbo].[comment_likes]    Script Date: 3/8/2025 10:43:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[comment_likes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[commentId] [int] NOT NULL,
	[userId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[comments]    Script Date: 3/8/2025 10:43:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[comments](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[postId] [int] NOT NULL,
	[userId] [int] NOT NULL,
	[content] [nvarchar](max) NOT NULL,
	[likes] [int] NULL,
	[date] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[post_claps]    Script Date: 3/8/2025 10:43:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[post_claps](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[postId] [int] NOT NULL,
	[userId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[posts]    Script Date: 3/8/2025 10:43:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[posts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NOT NULL,
	[title] [varchar](255) NOT NULL,
	[content] [nvarchar](max) NOT NULL,
	[imagePath] [varchar](255) NOT NULL,
	[date] [date] NULL,
	[claps] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 3/8/2025 10:43:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NOT NULL,
	[email] [varchar](255) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[role] [varchar](255) NULL,
	[imagePath] [varchar](255) NULL,
	[bio] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[comments] ADD  DEFAULT ((0)) FOR [likes]
GO
ALTER TABLE [dbo].[comments] ADD  CONSTRAINT [df_comment_date]  DEFAULT (getdate()) FOR [date]
GO
ALTER TABLE [dbo].[posts] ADD  CONSTRAINT [DF_Posts_Date]  DEFAULT (getdate()) FOR [date]
GO
ALTER TABLE [dbo].[posts] ADD  DEFAULT ((0)) FOR [claps]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ('registered') FOR [role]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ('no biography added') FOR [bio]
GO
ALTER TABLE [dbo].[comment_likes]  WITH CHECK ADD  CONSTRAINT [FK_comment_likes_commentId] FOREIGN KEY([commentId])
REFERENCES [dbo].[comments] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[comment_likes] CHECK CONSTRAINT [FK_comment_likes_commentId]
GO
ALTER TABLE [dbo].[comment_likes]  WITH CHECK ADD  CONSTRAINT [FK_comment_likes_userId] FOREIGN KEY([userId])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[comment_likes] CHECK CONSTRAINT [FK_comment_likes_userId]
GO
ALTER TABLE [dbo].[comments]  WITH CHECK ADD FOREIGN KEY([userId])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[comments]  WITH CHECK ADD  CONSTRAINT [FK_comments_postId] FOREIGN KEY([postId])
REFERENCES [dbo].[posts] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[comments] CHECK CONSTRAINT [FK_comments_postId]
GO
ALTER TABLE [dbo].[post_claps]  WITH CHECK ADD  CONSTRAINT [FK_post_claps_postId] FOREIGN KEY([postId])
REFERENCES [dbo].[posts] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[post_claps] CHECK CONSTRAINT [FK_post_claps_postId]
GO
ALTER TABLE [dbo].[posts]  WITH CHECK ADD  CONSTRAINT [FK_posts_userId] FOREIGN KEY([userId])
REFERENCES [dbo].[users] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[posts] CHECK CONSTRAINT [FK_posts_userId]
GO
